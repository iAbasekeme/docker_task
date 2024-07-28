import { Injectable } from '@nestjs/common';
import { DataSource, FindOptionsWhere, Repository } from 'typeorm';
import { RoomCategory } from './entities/room-category.entity';
import { keyBy } from '../../../lib/utils.lib';

@Injectable()
export class RoomCategoryRepository extends Repository<RoomCategory> {
  constructor(private dataSource: DataSource) {
    super(RoomCategory, dataSource.createEntityManager());
  }

  async findCategoriesWithRoomsCount(
    where: FindOptionsWhere<RoomCategory>[] | FindOptionsWhere<RoomCategory>,
  ) {
    const qb = this.createQueryBuilder('category')
      .leftJoin('category.rooms', 'room')
      .addSelect(['COUNT(room.id) as room_count'])
      .groupBy('category.id');

    if (where) {
      qb.where(where);
    }

    const { raw, entities } = await qb.getRawAndEntities();

    const catsLookup = keyBy(raw, 'category_id');
    return entities.map((entity) => ({
      ...entity,
      roomCount: +catsLookup[entity.id].room_count,
    }));
  }

  async countCategories(
    where: FindOptionsWhere<RoomCategory>[] | FindOptionsWhere<RoomCategory>,
  ) {
    return await this.count({ where });
  }
}
