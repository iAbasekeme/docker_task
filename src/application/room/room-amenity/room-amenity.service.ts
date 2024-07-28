import { Injectable } from '@nestjs/common';
import { CreateRoomAmenityDto } from './dto/create-room-amenity.dto';
import { UpdateRoomAmenityDto } from './dto/update-room-amenity.dto';
import { RoomAmenityRepository } from './room-amenity.repository';
import { FindRoomAmenityDto } from './dto/find-room-amenity.dto';
import { pick } from 'ramda';
import { PaginatedResult, Pagination } from 'src/lib/pagination.lib';
import { IsNull } from 'typeorm';

@Injectable()
export class RoomAmenityService {
  constructor(private roomAmenityRepository: RoomAmenityRepository) {}

  create(createRoomAmenityDto: CreateRoomAmenityDto) {
    return this.roomAmenityRepository.save(createRoomAmenityDto);
  }

  async createBulk(list: CreateRoomAmenityDto[]) {
    await this.roomAmenityRepository.save(list);
    return { success: true, message: 'success' };
  }

  async findAll(findDto: FindRoomAmenityDto, global?: boolean) {
    const { page, perPage, ...rest } = findDto;
    const pagination = new Pagination(page, perPage);
    const filter = pick(
      ['hotelId', 'roomId', 'name'],
      global ? { ...rest, hotelId: IsNull(), roomId: IsNull() } : rest,
    );
    const [result, total] = await this.roomAmenityRepository.findAndCount({
      where: filter,
      take: pagination.perPage,
      skip: pagination.skip,
    });
    return PaginatedResult.create(result, total, pagination);
  }

  update(id: string, updateRoomAmenityDto: UpdateRoomAmenityDto) {
    return this.roomAmenityRepository.save({ id, ...updateRoomAmenityDto });
  }

  remove(id: string) {
    return this.roomAmenityRepository.delete({ id });
  }
}
