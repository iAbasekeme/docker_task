import { Injectable } from '@nestjs/common';
import { Between, DataSource, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { NewSignUpsDto } from '../user/dto/new-signups.dto';
import * as moment from 'moment';
import { FindUserDto } from './dto/find-user.dto';
import { PaginatedResult, Pagination } from 'src/lib/pagination.lib';
import { UserMapper } from './domain/user.mapper';
import { buildEntitySortObjectFromQueryParam } from 'src/lib/utils.lib';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async newSignUpsCount() {
    const [initial, final] = resolveNewSignUpsInterval(1, 'weeks');
    return await this.count({
      where: {
        createdAt: Between(initial, final),
      },
    });
  }

  async newSignUps(newSignUpsDto: NewSignUpsDto) {
    const pagination = new Pagination(
      newSignUpsDto.page,
      newSignUpsDto.perPage,
    );
    const [initial, final] = resolveNewSignUpsInterval(1, 'weeks');
    let query = this.createQueryBuilder('user')
      .where({ createdAt: Between(initial, final) })
      .take(pagination.perPage)
      .skip(pagination.skip)
      .orderBy('user.createdAt', 'DESC');

    const [result, total] = await query.getManyAndCount();
    return PaginatedResult.create(result, total, pagination);
  }

  async findAll(dto: FindUserDto) {
    const pagination = new Pagination(dto.page, dto.perPage);
    const [result, total] = await this.findAndCount({
      where: UserMapper.toDB(dto),
      take: pagination.perPage,
      skip: pagination.skip,
      order: dto.sort
        ? buildEntitySortObjectFromQueryParam(dto.sort)
        : { createdAt: 'DESC' },
    });
    return PaginatedResult.create(result, total, pagination);
  }
}

function resolveNewSignUpsInterval(
  duration: number = 1,
  unit: 'hours' | 'days' | 'weeks' | 'months' = 'weeks',
) {
  const initialTime = moment().subtract(duration, unit).toDate();
  const finalTime = moment().toDate();
  return [initialTime, finalTime];
}
