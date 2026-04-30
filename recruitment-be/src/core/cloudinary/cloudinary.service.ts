import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './cloudinary-response';
import * as streamifier from 'streamifier';
import * as path from 'path';

@Injectable()
export class CloudinaryService {
  uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse> {
    return new Promise((resolve, reject) => {
      // 1. Xử lý tên file: Không dấu, không khoảng trắng
      const fileExt = path.extname(file.originalname).toLowerCase();
      const originalName = path.parse(file.originalname).name
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Khử tiếng Việt có dấu
        .replace(/\s+/g, '_') 
        .replace(/[^\w-]/g, '');

      const isPdf = fileExt === '.pdf';
      
      // 2. Cấu hình upload
      const uploadOptions: any = {
        folder: 'smartcv_resumes',
        // Nếu là PDF thì dùng 'image' để Cloudinary cho phép xem trực tiếp trên browser
        // Nếu là Word/Khác thì dùng 'raw'
        resource_type: isPdf ? 'image' : 'raw',
        // Đặt public_id bao gồm cả đuôi file để lúc tải về ko bị mất định dạng
        public_id: `${originalName}_${Date.now()}${fileExt}`,
      };

      const upload = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error('Upload failed'));
          resolve(result);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(upload);
    });
  }
}