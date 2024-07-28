import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { HotelRepository } from './hotel.repository';
import { Hotel } from './entities/hotel.entity';
import {
  resolvePointCoordinateFromLatLon,
  roundToNearestDecimal,
} from '../../lib/utils.lib';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { FindHotelDto } from './dto/find-hotel.dto';
import { Point } from '../../common/types';
import { HotelRating } from '../hotel-rating/entities/hotel-rating.entity';
import { omit } from 'ramda';
import { ResolveHotelVerificationStages } from './domain/resolve-hotel-verification-stages';
import { VerifyHotel } from './domain/verify-hotel';
import { HotelVerificationDto } from './dto/hotel-verification.dto';
import { CityRepository } from '../utility/location/city.repository';

@Injectable()
export class HotelService {
  logger = new Logger(HotelService.name);
  constructor(
    private hotelRepository: HotelRepository,
    private resolveHotelVerificationStages: ResolveHotelVerificationStages,
    private verifyHotel: VerifyHotel,
    private cityRepository: CityRepository,
  ) {}

  async create(createHotelDto: CreateHotelDto) {
    const { longitude, latitude, ...rest } = createHotelDto;
    let coordinates: Point;
    if (longitude && latitude) {
      coordinates = resolvePointCoordinateFromLatLon({
        longitude,
        latitude,
      });
    }
    if (createHotelDto.cityId) {
      const city = await this.cityRepository.findOne({
        where: { id: createHotelDto.cityId },
      });
      if (!city) {
        throw new NotFoundException('City not found');
      }
      rest.stateId = city.stateId;
      rest.countryId = city.countryId;
    }
    return await this.hotelRepository.save({
      ...rest,
      ...(coordinates ? { coordinates } : {}),
    });
  }

  async findOne(
    criteria: Partial<Pick<Hotel, 'id' | 'email' | 'affiliateId'>>,
    relations?: string[],
  ) {
    return this.hotelRepository.findHotel(criteria, relations);
  }

  async updateById(id: string, updates: Partial<Hotel | UpdateHotelDto>) {
    const { latitude, longitude, ...rest } = <UpdateHotelDto>updates;
    const dbUpdates: Partial<Hotel> = omit(
      [
        'email',
        'ratingCount',
        'averageRating',
        'approvedAt',
        'totalRating',
        'isEmailVerified',
        'isLocationVerified',
      ],
      <Hotel>rest,
    );
    if (longitude && latitude) {
      dbUpdates.coordinates = resolvePointCoordinateFromLatLon({
        latitude,
        longitude,
      });
    }
    if (updates.cityId) {
      const city = await this.cityRepository.findOne({
        where: { id: updates.cityId },
      });
      if (!city) {
        throw new NotFoundException('City not found');
      }
      dbUpdates.stateId = city.stateId;
      dbUpdates.countryId = city.countryId;
    }
    return await this.hotelRepository.save({ id, ...dbUpdates });
  }

  async updateBy(
    criteria: Partial<
      Pick<Hotel, 'email' | 'id' | 'ownerId' | 'name' | 'isEmailVerified'>
    >,
    updates: Partial<Hotel | UpdateHotelDto>,
  ) {
    const { latitude, longitude, ...rest } = <UpdateHotelDto>updates;
    const dbUpdates: Hotel = <Hotel>rest;
    if (longitude && latitude) {
      dbUpdates.coordinates = resolvePointCoordinateFromLatLon({
        latitude,
        longitude,
      });
    }
    if (updates.cityId) {
      const city = await this.cityRepository.findOne({
        where: { id: updates.cityId },
      });
      if (!city) {
        throw new NotFoundException('City not found');
      }
      rest.stateId = city.stateId;
      rest.countryId = city.countryId;
    }
    return await this.hotelRepository.update(criteria, { ...dbUpdates });
  }

  async findAll(findHotelDto?: FindHotelDto) {
    return await this.hotelRepository.findAll(findHotelDto);
  }

  async count() {
    return await this.hotelRepository.count();
  }

  async updateRating(review: HotelRating) {
    const hotel = await this.hotelRepository.findOne({
      where: { id: review.hotelId },
    });
    if (!hotel) {
      return;
    }
    hotel.totalRating =
      (Number(hotel.totalRating) || 0) + Number(review.rating);
    hotel.ratingCount = (Number(hotel.ratingCount) || 0) + 1;
    hotel.averageRating = hotel.totalRating / (hotel.ratingCount || 1);
    hotel.averageRating = roundToNearestDecimal(hotel.averageRating, 1);
    return await this.hotelRepository.save({ id: hotel.id, ...hotel });
  }

  async resolveVerificationStages(hotelId: string) {
    return await this.resolveHotelVerificationStages.execute(hotelId);
  }

  async checkAndVerifyHotel(hotelId: string, dto: HotelVerificationDto) {
    return await this.verifyHotel.execute(hotelId, dto);
  }
}
