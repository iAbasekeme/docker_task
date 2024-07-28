import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateCheckInCheckOutDto } from '../dto/create-check-in-check-out.dto';
import { BookingService } from 'src/application/booking/booking.service';
import {
  BookingStatus,
  BookingStatusLevel,
} from 'src/application/booking/entities/booking.entity';
import {
  CheckInCheckOut,
  CheckInCheckOutType,
} from '../entities/check-in-check-out.entity';
import { CheckInCheckOutRepository } from '../check-in.repository';
import { RoomService } from 'src/application/room/room.service';
import { RoomAvailabilityStatus } from 'src/application/room/entities/room.entity';

@Injectable()
export class CancelBooking {
  logger = new Logger(CancelBooking.name);
  constructor(
    private bookingService: BookingService,
    private checkInCheckOutRepository: CheckInCheckOutRepository,
    private roomService: RoomService,
  ) {}

  async execute(createCheckInCheckOutDto: CreateCheckInCheckOutDto) {
    return await this.cancelBooking(createCheckInCheckOutDto);
  }

  async cancelBooking(createCheckInCheckOutDto: CreateCheckInCheckOutDto) {
    const booking = await this.bookingService.findOne({
      id: createCheckInCheckOutDto.bookingId,
    });
    if (BookingStatusLevel[booking.status] > BookingStatusLevel.approved) {
      throw new BadRequestException(
        `Booking cannot be cancelled. Status is ${booking.status}`,
      );
    }

    const cancelled = new CheckInCheckOut();
    cancelled.bookingId = createCheckInCheckOutDto.bookingId;
    cancelled.type = CheckInCheckOutType.cancelled;
    const saved = await this.checkInCheckOutRepository.save(cancelled);

    await this.changeBookingToCancelled(booking.id);
    await this.changeRoomToAvailable(booking.roomId);

    return saved;
  }

  async changeBookingToCancelled(bookingId: string) {
    await this.bookingService.update(bookingId, {
      status: BookingStatus.cancelled,
    });
  }

  async changeRoomToAvailable(roomId: string) {
    await this.roomService.update(roomId, {
      status: RoomAvailabilityStatus.available,
    });
  }
}
