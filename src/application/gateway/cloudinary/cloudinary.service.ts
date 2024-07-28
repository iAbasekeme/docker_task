import { Inject } from '@nestjs/common';
import { FileUploadResponse } from './cloudinary-response';
import { Readable } from 'stream';
import { v2 } from 'cloudinary';

export class CloudinaryService {
  constructor(@Inject('Cloudinary') private cloudinary: typeof v2) {}

  async uploadFile(file: Express.Multer.File): Promise<FileUploadResponse> {
    return await new Promise((resolve, reject) => {
      const uploadStream = this.cloudinary.uploader.upload_stream(
        { folder: 'user_assets', unique_filename: true },
        (err, res) => {
          if (err) {
            return reject(new Error(err.message));
          }
          resolve(res);
        },
      );
      Readable.from(file.buffer).pipe(uploadStream);
    });
  }
}
