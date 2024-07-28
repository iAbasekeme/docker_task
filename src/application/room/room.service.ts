import { Injectable } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';
import { CreateRoomDto } from './dto/create-room.dto';
import { RoomRepository } from './room.repository';
import { CreateRoomValidator } from './validators/create-room.validator';
import { FindRoomDto } from './dto/find.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room } from './entities/room.entity';
import { HotelRating } from '../hotel-rating/entities/hotel-rating.entity';
import { AuditBuilder } from '../audit/helpers/audit-builder.helper';
import { AuditService } from '../audit/audit.service';
import { roundToNearestDecimal } from 'src/lib/utils.lib';

@Injectable()
export class RoomService {
  constructor(
    private roomRepository: RoomRepository,
    private createRoomValidator: CreateRoomValidator,
  ) {}

  @Transactional()
  async create(createRoomDto: CreateRoomDto) {
    await this.createRoomValidator.validateOrThrow(createRoomDto);
    return await this.roomRepository.save(createRoomDto);
  }

  async find(findRoomDto: FindRoomDto) {
    return this.roomRepository.findAll(findRoomDto);
  }

  async update(roomId: string, updates: UpdateRoomDto) {
    await this.roomRepository.save({ id: roomId, ...updates });
  }

  async findById(roomId: string, relations?: string[]) {
    return await this.roomRepository.findOne({
      where: { id: roomId },
      relations: relations?.length
        ? relations
        : ['category', 'images', 'hotel', 'category', 'amenities'],
    });
  }

  async updateById(id: string, updates: Partial<Room>) {
    return await this.roomRepository.save({ id, ...updates });
  }

  async delete(criteria: Partial<Room>) {
    return await this.roomRepository.softRemove(criteria);
  }

  async updateRating(review: HotelRating) {
    if (review.roomId) {
      const room = await this.roomRepository.findOne({
        where: { id: review.roomId },
      });
      if (!room) {
        return;
      }
      room.totalRating =
        (Number(room.totalRating) || 0) + Number(review.rating);
      room.ratingCount = (Number(room.ratingCount) || 0) + 1;
      room.averageRating = room.totalRating / (room.ratingCount || 1);
      room.averageRating = roundToNearestDecimal(room.averageRating, 1);
      return await this.roomRepository.save({ id: room.id, ...room });
    }
  }
}
