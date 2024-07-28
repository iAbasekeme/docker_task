import { Injectable } from '@nestjs/common';
import { CreateRoomImageDto } from './dto/create-room-image.dto';
import { RoomImageRepository } from './room-image.repository';

@Injectable()
export class RoomImageService {
  constructor(private roomImageRepository: RoomImageRepository) {}

  async create(roomId: string, imageDto: CreateRoomImageDto) {
    await this.roomImageRepository.delete({ roomId });
    return await this.roomImageRepository.save(
      imageDto.urls.map((url) => ({ url, roomId })),
    );
  }

  async find(roomId: string) {
    return await this.roomImageRepository.find({ where: { roomId } });
  }
}
