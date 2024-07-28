import { Injectable } from '@nestjs/common';
import { CreateRoomCategoryDto } from './dto/create-room-category.dto';
import { UpdateRoomCategoryDto } from './dto/update-room-category.dto';
import { RoomCategoryRepository } from './room-category.repository';
import { FindRoomCategoryDto } from './dto/find-room-category.dto';

@Injectable()
export class RoomCategoryService {
  constructor(private roomCategoryRepository: RoomCategoryRepository) {}

  async create(createRoomCategoryDto: CreateRoomCategoryDto) {
    return await this.roomCategoryRepository.save(createRoomCategoryDto);
  }

  async findAll(query: Omit<FindRoomCategoryDto, 'images'>) {
    return await this.roomCategoryRepository.findCategoriesWithRoomsCount(
      query,
    );
  }

  async update(id: string, updateRoomCategoryDto: UpdateRoomCategoryDto) {
    return await this.roomCategoryRepository.save({
      id,
      ...updateRoomCategoryDto,
    });
  }

  async delete(id: string) {
    return await this.roomCategoryRepository.delete({ id });
  }

  async findById(id: string) {
    return await this.roomCategoryRepository.findOne({ where: { id } });
  }
}
