import { Module } from '@nestjs/common';
import { CheckInCheckOutService } from './check-in-check-out.service';
import { CheckInCheckOutController } from './check-in-check-out.controller';
import { BookingModule } from '../booking/booking.module';
import { CheckInCheckOutRepository } from './check-in.repository';
import { CheckIn } from './domain/check-in';
import { CheckedInEventListener } from './listeners/checked-in.listener';
import { CheckOut } from './domain/check-out';
import { RoomModule } from '../room/room.module';
import { CancelBooking } from './domain/cancel-booking';
import { PendingReviewModule } from '../pending-review/pending-review.module';
import { CheckedOutEventListener } from './listeners/checked-out.listener';

@Module({
  imports: [BookingModule, RoomModule, PendingReviewModule],
  controllers: [CheckInCheckOutController],
  providers: [
    CheckInCheckOutService,
    CheckInCheckOutRepository,
    CheckIn,
    CheckOut,
    CancelBooking,
    CheckedInEventListener,
    CheckedOutEventListener,
  ],
  exports: [CheckInCheckOutService, CheckInCheckOutRepository],
})
export class CheckInCheckOutModule {}
