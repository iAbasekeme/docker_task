import { Injectable, NotFoundException } from '@nestjs/common';
import { Brackets, DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { Hotel } from './entities/hotel.entity';
import { FindHotelDto } from './dto/find-hotel.dto';
import { PaginatedResult, Pagination } from 'src/lib/pagination.lib';
import { HotelMapper } from './domain/hotel-mapper';
import { RoomRepository } from '../room/room.repository';
import { RoomCategoryRepository } from '../room/room-category/room-category.repository';

@Injectable()
export class HotelRepository extends Repository<Hotel> {
  constructor(
    private dataSource: DataSource,
    private roomRepository: RoomRepository,
    private roomCategoryRepository: RoomCategoryRepository,
  ) {
    super(Hotel, dataSource.createEntityManager());
  }

  private applyLocationGeometryFilter(
    queryBuilder: SelectQueryBuilder<Hotel>,
    lat: number | string,
    lon: number | string,
    radius: number | string,
  ) {
    if (lat && lon) {
      queryBuilder.andWhere(
        'ST_DWithin(hotel.coordinates, ST_MakePoint(:lon, :lat), :radius)',
        {
          lon,
          lat,
          radius: radius || 2000,
        },
      );
      // queryBuilder.orderBy(
      //   'ST_Distance(hotel.coordinates, ST_MakePoint(:lon, :lat))',
      //   'DESC',
      // );
    }
  }

  private applySearchFilter(
    queryBuilder: SelectQueryBuilder<Hotel>,
    search: string,
  ) {
    if (search) {
      const searchTerm = search;
      queryBuilder.leftJoin('hotel.roomCategories', 'roomCategory').andWhere(
        new Brackets((searchQb) => {
          searchQb.where(
            'LOWER("roomCategory"."name") ILIKE :searchTerm OR LOWER("roomCategory"."description") ILIKE :searchTerm OR LOWER("hotel"."name") ILIKE :searchTerm OR LOWER("hotel"."address") ILIKE :searchTerm',
            {
              searchTerm: `%${searchTerm.toLowerCase()}%`,
            },
          );
        }),
      );
    }
  }

  async findAll(findHotelDto?: FindHotelDto) {
    const {
      page,
      perPage,
      referenceLatitude,
      referenceLongitude,
      radiusInMeters,
      relations,
    } = findHotelDto || {};
    const pagination = new Pagination(page, perPage);

    const relationsList = relations ? relations.split(/\s*,\s*/) : null;

    const queryBuilder = this.dataSource
      .createQueryBuilder(Hotel, 'hotel')
      .innerJoinAndSelect('hotel.images', 'image')
      .andWhere(HotelMapper.toDB(findHotelDto));

    if (relationsList?.length) {
      for (let relation of relationsList) {
        if (relation === 'banks') {
          queryBuilder.leftJoinAndSelect('hotel.banks', 'bank');
        }
      }
    }

    this.applyLocationGeometryFilter(
      queryBuilder,
      referenceLatitude,
      referenceLongitude,
      radiusInMeters || 2000,
    );

    this.applySearchFilter(queryBuilder, findHotelDto.search);

    if (findHotelDto?.sort) {
      HotelMapper.toSort(findHotelDto.sort, queryBuilder);
    }

    const [result, total] = await queryBuilder
      .skip(pagination.skip)
      .take(pagination.perPage)
      .getManyAndCount();

    return PaginatedResult.create(
      await this.hotelsWithRoomsCount(result),
      total,
      pagination,
    );
  }

  protected async hotelsWithRoomsCount(list: Hotel[]) {
    return await Promise.all(
      list.map(async (h) => ({
        ...h,
        roomsCount: await this.roomRepository.count({
          where: { hotelId: h.id },
        }),
      })),
    );
  }

  async findHotel(
    criteria: Partial<Pick<Hotel, 'id' | 'email'>>,
    relations?: string[],
  ): Promise<Hotel & { roomsCount: number; roomCategoriesCount: number }> {
    const hotel = await this.findOne({ where: criteria, relations });
    if (!hotel) {
      throw new NotFoundException('hotel not found');
    }
    const [roomsCount, roomCategoriesCount] = await Promise.all([
      this.roomRepository.countRooms({
        hotelId: criteria.id,
      }),
      this.roomCategoryRepository.countCategories({ hotelId: criteria.id }),
    ]);
    return { ...hotel, roomsCount, roomCategoriesCount };
  }
}
