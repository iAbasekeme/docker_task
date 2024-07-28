import { Module } from '@nestjs/common';
import { HotelImageService } from './hotel-image.service';
import { HotelImageRepository } from './hotel-image.repository';

@Module({
  providers: [HotelImageService, HotelImageRepository],
  exports: [HotelImageService, HotelImageRepository],
})
export class HotelImageModule {}
