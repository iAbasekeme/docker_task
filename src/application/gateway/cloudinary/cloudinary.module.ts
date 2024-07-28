import { Module } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryService } from './cloudinary.service';
import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
} from '../../../config/env.config';

@Module({
  providers: [
    CloudinaryService,
    {
      provide: 'Cloudinary',
      useFactory: () => {
        cloudinary.config({
          cloud_name: CLOUDINARY_CLOUD_NAME,
          api_key: CLOUDINARY_API_KEY,
          api_secret: CLOUDINARY_API_SECRET,
        });
        return cloudinary;
      },
    },
  ],
  exports: [CloudinaryService],
})
export class CloudinaryModule {}
