import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SuspensionRepository } from './suspension.repository';
import { CreateSuspensionDto } from './dto/create-suspension.dto';
import { HotelRepository } from '../hotel/hotel.repository';
import { Transactional } from 'typeorm-transactional';
import { time } from '../../lib/utils.lib';
import { Hotel } from '../hotel/entities/hotel.entity';

@Injectable()
export class SuspensionService {
  constructor(
    private suspensionRepository: SuspensionRepository,
    private hotelRepository: HotelRepository,
  ) {}

  async toggleHotelSuspension(hotelId: string, dto: CreateSuspensionDto) {
    const hotel = await this.hotelRepository.findOne({
      where: { id: hotelId },
    });
    if (!hotel) {
      throw new NotFoundException('hotel not found');
    }
    return await this.suspendOrReleaseHotel(hotel, dto);
  }

  @Transactional()
  private async suspendOrReleaseHotel(hotel: Hotel, dto: CreateSuspensionDto) {
    if (hotel.isActive) {
      if (!dto.reason) {
        throw new BadRequestException('suspension reason is required');
      }
      await this.hotelRepository.save({ ...hotel, isActive: false });
      const suspension = this.suspensionRepository.create();
      suspension.entityId = hotel.id;
      suspension.entityType = 'hotel';
      suspension.reason = dto.reason;
      if (dto.durationSeconds) {
        const supposedReleasedAt = time()
          .init()
          .add(dto.durationSeconds, 'seconds')
          .toDate();
        suspension.supposedReleasedAt = supposedReleasedAt;
      }
      const saved = await this.suspensionRepository.save(suspension);
      // notify of suspended account
      return saved;
    } else {
      await this.hotelRepository.save({ ...hotel, isActive: true });
      await this.suspensionRepository.update(
        { entityId: hotel.id, entityType: 'hotel' },
        { releasedAt: time().init().toDate() },
      );
      // notify of released account
    }
  }
}
