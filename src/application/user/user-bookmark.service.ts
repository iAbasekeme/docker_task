import { Injectable } from '@nestjs/common';
import { ILike } from 'typeorm';
import { UserBookmarkRepository } from './user-bookmark.repository';
import { BaseQueryDto } from '../../common/dto';
import { User } from './entities/user.entity';
import { PaginatedResult, Pagination } from '../../lib/pagination.lib';
import { AtLeastOne } from '../../common/types';

@Injectable()
export class UserBookmarkService {
  constructor(private userBookmarkRepository: UserBookmarkRepository) {}

  async create(userId: string, hotelId: string) {
    const exists = await this.userBookmarkRepository.findOne({
      where: { userId, hotelId },
    });
    if (exists) {
      return exists;
    }
    return await this.userBookmarkRepository.save({ userId, hotelId });
  }

  async find(user: User, dto: BaseQueryDto) {
    const { page, perPage, search } = dto || {};
    const pagination = new Pagination(page, perPage);
    const [result, total] = await this.userBookmarkRepository.findAndCount({
      where: search
        ? {
            userId: user.id,
            hotel: {
              name: ILike(`%${search}%`),
            },
          }
        : { userId: user.id },
      relations: ['hotel', 'hotel.images'],
      order: { createdAt: 'DESC' },
      take: pagination.perPage,
      skip: pagination.skip,
    });
    return PaginatedResult.create(
      result.map((b) => ({ ...b.hotel, savedAt: b.createdAt })),
      total,
      pagination,
    );
  }

  async delete(query: AtLeastOne<{ hotelId: string; userId: string }>) {
    await this.userBookmarkRepository.delete({
      userId: query.userId,
      hotelId: query.hotelId,
    });
    return { success: true, message: 'hotel successfully deleted from bookmark' };
  }
}
