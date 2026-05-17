import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';
import { PDFParse } from 'pdf-parse';
import * as mammoth from 'mammoth';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private genAI: GoogleGenerativeAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.listAvailableModels(); // Gọi để debug khi khởi tạo
    } else {
      this.logger.error('GEMINI_API_KEY is not configured');
    }
  }

  async listAvailableModels() {
    try {
      const apiKey = this.configService.get('GEMINI_API_KEY');
      const response = await axios.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
      const modelNames = response.data.models.map((m: any) => m.name.replace('models/', ''));
      this.logger.log('--- DANH SÁCH MODEL KHẢ DỤNG CHO KEY CỦA BẠN ---');
      this.logger.log(modelNames.join(', '));
      this.logger.log('------------------------------------------------');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error('Không thể lấy danh sách model: ' + errorMessage);
    }
  }

  async extractTextFromPdf(url: string): Promise<string> {
    try {
      this.logger.log(`Extracting text from PDF: ${url}`);
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      const buffer = Buffer.from(response.data);
      
      const parser = new PDFParse({ data: buffer });
      const result = await parser.getText();
      
      return result.text || '';
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Error extracting text from PDF: ${errorMessage}`);
      return '';
    }
  }

  async extractTextFromDocx(url: string): Promise<string> {
    try {
      this.logger.log(`Extracting text from DOCX: ${url}`);
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      const buffer = Buffer.from(response.data);
      
      const result = await mammoth.extractRawText({ buffer });
      return result.value || '';
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Error extracting text from DOCX: ${errorMessage}`);
      return '';
    }
  }

  async analyzeResumeWithGemini(text: string): Promise<{ skills: string[]; jobTitle: string }> {
    if (!this.genAI) {
      throw new Error('Gemini AI is not initialized. Check your GEMINI_API_KEY in .env');
    }

    if (!text || text.trim().length === 0) {
      this.logger.warn('Empty text provided to Gemini');
      return { skills: [], jobTitle: 'Ứng viên' };
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });

      const prompt = `
        Bạn là một chuyên gia tuyển dụng. Hãy phân tích nội dung CV dưới đây và trích xuất thông tin.
        HÃY TRẢ VỀ DUY NHẤT MÃ JSON, KHÔNG THÊM VĂN BẢN GIẢI THÍCH.
        {
          "skills": ["skill 1", "skill 2", ...],
          "jobTitle": "vị trí công việc"
        }
        Nội dung CV:
        ${text.substring(0, 10000)}
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let responseText = response.text();
      
      responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      
      return JSON.parse(responseText);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Error analyzing resume with Gemini: ${errorMessage}`);
      return { skills: [], jobTitle: 'N/A' };
    }
  }

  async analyzeJobWithGemini(title: string, description: string, requirement: string): Promise<{ skills: string[] }> {
    if (!this.genAI) {
      throw new Error('Gemini AI is not initialized');
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });

      const prompt = `
        Bạn là một chuyên gia tuyển dụng. Hãy phân tích nội dung tuyển dụng dưới đây và trích xuất danh sách các kỹ năng kỹ thuật, công nghệ yêu cầu.
        HÃY TRẢ VỀ DUY NHẤT MÃ JSON, KHÔNG THÊM VĂN BẢN GIẢI THÍCH.
        
        {
          "skills": ["tên công nghệ 1", "tên công nghệ 2", ...]
        }

        Tiêu đề: ${title}
        Mô tả: ${description}
        Yêu cầu: ${requirement}
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let responseText = response.text();
      responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      
      return JSON.parse(responseText);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Error analyzing job with Gemini: ${errorMessage}`);
      return { skills: [] };
    }
  }
}
