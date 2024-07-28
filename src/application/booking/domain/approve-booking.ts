import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BookingRepository } from '../booking.repository';
import { BookingStatus, BookingStatusLevel } from '../entities/booking.entity';
import { BookingApprovedEvent } from '../event/booking-approved.event';

@Injectable()
export class ApproveBookingCommand {
  constructor(
    private bookingRepository: BookingRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  async execute(bookingId: string) {
    const booking = await this.bookingRepository.findOne({
      where: { id: bookingId },
      lock: {
        mode: 'pessimistic_partial_write',
      },
    });
    if (!booking) {
      throw new BadRequestException('booking not found');
    }
    if (BookingStatusLevel[booking.status] >= BookingStatusLevel.approved) {
      throw new ConflictException('Booking has been approved already');
    }
    const saved = await this.bookingRepository.save({
      id: bookingId,
      status: BookingStatus.approved,
    });
    this.eventEmitter.emit(
      BookingApprovedEvent.eventName,
      new BookingApprovedEvent({ booking }),
    );
    return saved;
  }
}
