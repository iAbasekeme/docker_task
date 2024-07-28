import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateCheckInCheckOutDto } from '../dto/create-check-in-check-out.dto';
import {
  BookingStatus,
  BookingStatusLevel,
} from 'src/application/booking/entities/booking.entity';
import {
  CheckInCheckOut,
  CheckInCheckOutType,
} from '../entities/check-in-check-out.entity';
import { BookingService } from 'src/application/booking/booking.service';
import { CheckInCheckOutRepository } from '../check-in.repository';
import { CheckedInEvent } from '../event/checked-in.event';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Transactional } from 'typeorm-transactional';
import { RoomService } from 'src/application/room/room.service';
import { RoomAvailabilityStatus } from 'src/application/room/entities/room.entity';

@Injectable()
export class CheckIn {
  logger = new Logger(CheckIn.name);
  constructor(
    private checkInCheckOutRepository: CheckInCheckOutRepository,
    private bookingService: BookingService,
    private eventEmitter: EventEmitter2,
    private roomService: RoomService,
  ) {}

  async execute(createCheckInCheckOutDto: CreateCheckInCheckOutDto) {
    return await this.checkIn(createCheckInCheckOutDto);
  }

  @Transactional()
  private async checkIn(createCheckInCheckOutDto: CreateCheckInCheckOutDto) {
    const booking = await this.findBookingOrThrow(
      createCheckInCheckOutDto.bookingId,
    );
    if (BookingStatusLevel[booking.status] > BookingStatusLevel.approved) {
      throw new BadRequestException('user has been checked in already');
    }
    const checkIn = new CheckInCheckOut();
    checkIn.bookingId = createCheckInCheckOutDto.bookingId;
    checkIn.type = CheckInCheckOutType.checkedIn;
    const checkedIn = await this.checkInCheckOutRepository.save(checkIn);

    await this.changeBookingToCheckedIn(booking.id);
    await this.changeRoomToOccupied(booking.roomId);

    this.eventEmitter.emit(
      CheckedInEvent.eventName,
      new CheckedInEvent({ checkIn: checkedIn }),
    );
    return checkedIn;
  }

  private async changeBookingToCheckedIn(bookingId: string) {
    await this.bookingService.update(bookingId, {
      status: BookingStatus.checkedIn,
    });
  }

  private async changeRoomToOccupied(roomId: string) {
    return await this.roomService.update(roomId, {
      status: RoomAvailabilityStatus.occupied,
    });
  }

  private async findBookingOrThrow(bookingId: string) {
    this.logger.log('validating booking id', { bookingId });
    const bookingExists = await this.bookingService.findOne({ id: bookingId });
    if (!bookingExists) {
      throw new BadRequestException('booking does not exists');
    }
    return bookingExists;
  }
}
