import { Injectable } from '@nestjs/common';
import {
  Brackets,
  DataSource,
  FindOptionsWhere,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { Room } from './entities/room.entity';
import { FindRoomDto } from './dto/find.dto';
import { PaginatedResult, Pagination } from 'src/lib/pagination.lib';
import { RoomMapper } from './domain/room.mapper';

@Injectable()
export class RoomRepository extends Repository<Room> {
  constructor(private dataSource: DataSource) {
    super(Room, dataSource.createEntityManager());
  }

  applySearchFilter(queryBuilder: SelectQueryBuilder<Room>, search: string) {
    if (search) {
      const searchTerm = search;
      queryBuilder.andWhere(
        new Brackets((searchQb) => {
          searchQb.where(
            'LOWER("room"."room_id") ILIKE :searchTerm OR LOWER("room"."description") ILIKE :searchTerm OR LOWER("category"."name") ILIKE :searchTerm OR LOWER("category"."description") ILIKE :searchTerm OR LOWER("amenity"."name") ILIKE :searchTerm',
            {
              searchTerm: `%${searchTerm.toLowerCase()}%`,
            },
          );
        }),
      );
    }
  }

  async findAll(findRoomDto: FindRoomDto) {
    const { page, perPage } = findRoomDto;
    const pagination = new Pagination(page, perPage);
    const queryBuilder = this.createQueryBuilder('room')
      .leftJoinAndSelect('room.images', 'image')
      .leftJoinAndSelect('room.category', 'category')
      .leftJoinAndSelect('room.amenities', 'amenity')
      .andWhere(RoomMapper.toDB(findRoomDto));

    this.applySearchFilter(queryBuilder, findRoomDto.search);

    const [result, total] = await queryBuilder
      .skip(pagination.skip)
      .take(pagination.perPage)
      .getManyAndCount();

    return PaginatedResult.create(result, total, pagination);
  }

  async countRooms(where: FindOptionsWhere<Room>[] | FindOptionsWhere<Room>) {
    return await this.count({ where });
  }
}
