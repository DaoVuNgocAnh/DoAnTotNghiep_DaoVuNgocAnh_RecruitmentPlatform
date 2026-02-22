import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './cloudinary-response';
const streamifier = require('streamifier');

@Injectable()
export class CloudinaryService {
  uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream((error, result) => {
        if (error) return reject(error);
        
        if (!result) {
          return reject(new Error('Cloudinary upload result is undefined'));
        }

        resolve(result);
      });

      streamifier.createReadStream(file.buffer).pipe(upload);
    });
  }
}