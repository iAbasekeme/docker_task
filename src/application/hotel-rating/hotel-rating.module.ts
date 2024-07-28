import { Module } from '@nestjs/common';
import { RatingsController } from './hotel-rating.controller';
import { RatingsService } from './hotel-rating.service';
import { HotelRatingRepository } from './hotel-rating.repository';
import { HotelModule } from '../hotel/hotel.module';
import { UserModule } from '../user/user.module';
import { RoomModule } from '../room/room.module';
import { HotelRatedListener } from './listeners/rated.listener';
import { PendingReviewModule } from '../pending-review/pending-review.module';

@Module({
  imports: [HotelModule, UserModule, RoomModule, PendingReviewModule],
  controllers: [RatingsController],
  providers: [RatingsService, HotelRatingRepository, HotelRatedListener],
  exports: [RatingsService, HotelRatingRepository],
})
export class ReviewRatingsModule {}
