/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { HotelRatingRepository } from './hotel-rating.repository';
import { CreateHotelRatingReviewDto } from './dto/create-hotel-rating-review.dto';
import { HotelRepository } from '../hotel/hotel.repository';
import { UserRepository } from '../user/user.repository';
import { HotelRating } from './entities/hotel-rating.entity';
import { UpdateHotelReviewRatingDto } from './dto/update-hotel-rating-review.dto';
import { FindRatingReviewDto } from './dto/find-rating-review.dto';
import { PaginatedResult, Pagination } from '../../lib/pagination.lib';
import { Person } from '../authentication/factories/person.factory';
import { HotelRatedEvent } from './events/rated.event';

@Injectable()
export class RatingsService {
  constructor(
    private hotelRatingRepository: HotelRatingRepository,
    private hotelRepository: HotelRepository,
    private UserRepository: UserRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(
    createHotelRatingReviewDto: CreateHotelRatingReviewDto,
  ): Promise<HotelRating> {
    const [hotel, user] = await Promise.all([
      this.hotelRepository.findOne({
        where: { id: createHotelRatingReviewDto.hotelId },
      }),
      this.UserRepository.findOne({
        where: { id: createHotelRatingReviewDto.userId },
      }),
    ]);
    if (!hotel) {
      throw new BadRequestException('invalid hotel id');
    }
    if (!user) {
      throw new BadRequestException('invalid user');
    }
    const newRating = new HotelRating();
    newRating.userId = createHotelRatingReviewDto.userId;
    newRating.hotelId = hotel.id;
    newRating.rating = createHotelRatingReviewDto.rating;
    newRating.review = createHotelRatingReviewDto.review;
    if (createHotelRatingReviewDto.roomId) {
      newRating.roomId = createHotelRatingReviewDto.roomId;
    }
    if (createHotelRatingReviewDto.bookingId) {
      newRating.bookingId = createHotelRatingReviewDto.bookingId;
    }
    if (createHotelRatingReviewDto.images) {
      newRating.images = createHotelRatingReviewDto.images;
    }

    const rating = await this.hotelRatingRepository.save(newRating);

    this.eventEmitter.emit(HotelRatedEvent.eventName, new HotelRatedEvent(rating));

    return rating;
  }

  async delete(reviewId: string) {
    const reviewRating = this.hotelRatingRepository.findOne({
      where: { id: reviewId },
    });
    if (!reviewRating) {
      throw new BadRequestException('invalid rating id');
    }
    await this.hotelRatingRepository.delete(reviewId);
    return { success: true, message: 'review deleted successfully' };
  }

  async find(dto: FindRatingReviewDto, relations?: string[]) {
    const { page, perPage, search, ...rest } = dto || {};
    const pagination = new Pagination(page, perPage);
    const [reviews, total] = await this.hotelRatingRepository.findAndCount({
      where: rest,
      relations: relations || ['user'],
      take: pagination.perPage,
      skip: pagination.skip,
      order: { createdAt: 'DESC' },
    });

    return PaginatedResult.create(reviews, total, pagination);
  }

  async update(
    reviewer: Person,
    reviewId: string,
    UpdateHotelReviewRatingDto: UpdateHotelReviewRatingDto,
  ) {
    const review = await this.hotelRatingRepository.findOne({
      where: { id: reviewId, userId: reviewer.id },
    });
    if (!review) {
      throw new NotFoundException('review not found');
    }
    if (UpdateHotelReviewRatingDto.rating !== undefined) {
      review.rating = UpdateHotelReviewRatingDto.rating;
    }

    if (UpdateHotelReviewRatingDto.review !== undefined) {
      review.review = UpdateHotelReviewRatingDto.review;
    }
    return this.hotelRatingRepository.save(review);
  }
}
