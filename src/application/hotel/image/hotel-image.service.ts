import { Injectable } from '@nestjs/common';
import { HotelImageRepository } from './hotel-image.repository';
import { CreateImageDto } from './create-image.dto';

@Injectable()
export class HotelImageService {
  constructor(private readonly hotelImageRepository: HotelImageRepository) {}

  async create(hotelId: string, imageDto: CreateImageDto) {
    await this.hotelImageRepository.delete({ hotelId });
    return await this.hotelImageRepository.save(
      imageDto.urls.map((url) => ({ url, hotelId })),
    );
  }

  async find(hotelId: string) {
    return await this.hotelImageRepository.find({ where: { hotelId } });
  }
}
