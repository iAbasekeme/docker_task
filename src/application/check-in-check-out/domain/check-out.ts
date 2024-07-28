import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Transactional } from 'typeorm-transactional';
import { CreateCheckInCheckOutDto } from '../dto/create-check-in-check-out.dto';
import { CheckInCheckOutRepository } from '../check-in.repository';
import { BookingService } from '../../booking/booking.service';
import { BookingStatus } from '../../booking/entities/booking.entity';
import {
  CheckInCheckOut,
  CheckInCheckOutType,
} from '../entities/check-in-check-out.entity';
import { CheckedOutEvent } from '../event/checked-out.event';
import { RoomService } from 'src/application/room/room.service';
import { RoomAvailabilityStatus } from 'src/application/room/entities/room.entity';

@Injectable()
export class CheckOut {
  logger = new Logger(CheckOut.name);
  constructor(
    private checkInCheckOutRepository: CheckInCheckOutRepository,
    private bookingService: BookingService,
    private eventEmitter: EventEmitter2,
    private roomService: RoomService,
  ) {}

  async execute(createCheckInCheckOutDto: CreateCheckInCheckOutDto) {
    return await this.checkOut(createCheckInCheckOutDto);
  }

  @Transactional()
  private async checkOut(createCheckInCheckOutDto: CreateCheckInCheckOutDto) {
    const booking = await this.bookingService.findOne({
      id: createCheckInCheckOutDto.bookingId,
    });
    if (!booking) {
      throw new BadRequestException('booking not found');
    }
    if (booking.status !== BookingStatus.checkedIn) {
      throw new BadRequestException(
        `You can only checkout a booking that has been checked in. This booking has a status ${booking.status}`,
      );
    }
    const checkOut = new CheckInCheckOut();
    checkOut.bookingId = createCheckInCheckOutDto.bookingId;
    checkOut.type = CheckInCheckOutType.checkedOut;
    const checkedOut = await this.checkInCheckOutRepository.save(checkOut);

    await this.changeBookingToCheckedOut(booking.id);
    await this.changeRoomToAvailable(booking.roomId);

    this.eventEmitter.emit(
      CheckedOutEvent.eventName,
      new CheckedOutEvent({ checkOut: checkedOut }),
    );
    return checkedOut;
  }

  private async changeBookingToCheckedOut(bookingId: string) {
    await this.bookingService.update(bookingId, {
      status: BookingStatus.checkedOut,
    });
  }

  private async changeRoomToAvailable(roomId: string) {
    return await this.roomService.update(roomId, {
      status: RoomAvailabilityStatus.available,
    });
  }
}
