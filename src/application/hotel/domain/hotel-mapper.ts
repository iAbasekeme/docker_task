import { FindOptionsWhere, IsNull, Not, SelectQueryBuilder } from 'typeorm';
import { FindHotelDto } from '../dto/find-hotel.dto';
import { UpdateHotelDto } from '../dto/update-hotel.dto';
import { Hotel } from '../entities/hotel.entity';
import {
  buildEntitySortObjectFromQueryParam,
  optionalBooleanMapper,
} from 'src/lib/utils.lib';

export class HotelMapper {
  static toDB(dto: FindHotelDto | UpdateHotelDto | Hotel) {
    const dbQuery: FindOptionsWhere<Hotel> = {};
    const queryDto = dto as FindHotelDto;
    if (typeof queryDto?.isVerified === 'string') {
      const isVerified = optionalBooleanMapper.get(queryDto.isVerified);
      if (isVerified) {
        dbQuery.approvedAt = Not(IsNull());
      }
    }
    if (typeof queryDto?.isActive === 'string') {
      dbQuery.isActive = optionalBooleanMapper.get(queryDto.isActive);
    }
    if (queryDto?.cityId) {
      dbQuery.cityId = queryDto.cityId;
    }
    if (queryDto.countryId) {
      dbQuery.countryId = queryDto.countryId;
    }
    return dbQuery;
  }

  static toSort(
    sort: string | Record<string, any>,
    queryBuilder?: SelectQueryBuilder<Hotel>,
  ) {
    if (sort && queryBuilder) {
      this.sortWithQueryBuilder(sort, queryBuilder);
    }
  }

  static sortWithQueryBuilder(
    sort: string | Record<string, any>,
    queryBuilder?: SelectQueryBuilder<Hotel>,
  ) {
    if (!sort) {
      queryBuilder.orderBy('hotel.averageRating', 'DESC');
    }

    const sortObj =
      typeof sort === 'object'
        ? sort
        : buildEntitySortObjectFromQueryParam(sort);

    for (let key in sortObj) {
      if (this.isValidSortKeyAndValue(key, sortObj[key])) {
        const field = key.includes('.') ? key : `hotel.${key}`;
        queryBuilder.orderBy(field, sortObj[key]);
      } else {
        queryBuilder.orderBy('hotel.averageRating', 'DESC');
      }
    }
  }

  static isValidSortKeyAndValue(key: string, value: string) {
    return key && value && ['asc', 'desc'].includes(value.toLowerCase());
  }
}
