import { MiddlewareConsumer, Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { BookingRepository } from './booking.repository';
import { CreateBookingCommand } from './domain/create-booking';
import { RoomModule } from '../room/room.module';
import { BookedEventListener } from './listeners/booked.listener';
import { BookingApprovedEventListener } from './listeners/booking-approved.listener';
import { ApproveBookingCommand } from './domain/approve-booking';
import { HotelModule } from '../hotel/hotel.module';
import { ValidateHotelRequestMiddleware } from '../../common/validate-hotel-request.middleware';
import { PendingReviewModule } from '../pending-review/pending-review.module';

@Module({
  imports: [RoomModule, HotelModule, PendingReviewModule],
  controllers: [BookingController],
  providers: [
    BookingService,
    BookingRepository,
    CreateBookingCommand,
    ApproveBookingCommand,
    BookedEventListener,
    BookingApprovedEventListener,
  ],
  exports: [BookingService, BookingRepository],
})
export class BookingModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ValidateHotelRequestMiddleware).forRoutes(BookingController);
  }
}
