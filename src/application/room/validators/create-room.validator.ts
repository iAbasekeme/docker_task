import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreateRoomDto } from '../dto/create-room.dto';
import { HotelService } from 'src/application/hotel/hotel.service';
import { RoomCategoryService } from '../room-category/room-category.service';
import { RoomRepository } from '../room.repository';

@Injectable()
export class CreateRoomValidator {
  constructor(
    private hotelService: HotelService,
    private roomCategoryService: RoomCategoryService,
    private roomRepository: RoomRepository,
  ) {}

  async validateOrThrow(createRoomDto: CreateRoomDto): Promise<void> {
    const [hotel, roomCategory, exists] = await Promise.all([
      this.hotelService.findOne({ id: createRoomDto.hotelId }),
      this.roomCategoryService.findById(createRoomDto.roomCategoryId),
      this.roomRepository.findOne({
        where: {
          roomId: createRoomDto.roomId,
          roomCategoryId: createRoomDto.roomCategoryId,
          hotelId: createRoomDto.hotelId,
        },
      }),
    ]);

    if (!hotel) {
      throw new BadRequestException('Hotel id does not exist');
    }

    if (!roomCategory) {
      throw new BadRequestException('Room category id does not exist');
    }

    if (exists) {
      throw new ConflictException(
        `duplicate room: room already exists with name ${createRoomDto.roomId}`,
      );
    }
  }
}
