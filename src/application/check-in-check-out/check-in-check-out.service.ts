import { Injectable, Logger } from '@nestjs/common';
import { CreateCheckInCheckOutDto } from './dto/create-check-in-check-out.dto';
import { CheckIn } from './domain/check-in';
import { CheckOut } from './domain/check-out';
import { CancelBooking } from './domain/cancel-booking';

@Injectable()
export class CheckInCheckOutService {
  logger = new Logger(CheckInCheckOutService.name);
  constructor(
    private bookingCheckIn: CheckIn,
    private bookingCheckOut: CheckOut,
    private bookingCancellation: CancelBooking,
  ) {}

  async checkIn(createCheckInCheckOutDto: CreateCheckInCheckOutDto) {
    return await this.bookingCheckIn.execute(createCheckInCheckOutDto);
  }

  async checkOut(createCheckInCheckOutDto: CreateCheckInCheckOutDto) {
    return await this.bookingCheckOut.execute(createCheckInCheckOutDto);
  }

  async cancel(createCheckInCheckOutDto: CreateCheckInCheckOutDto) {
    return await this.bookingCancellation.execute(createCheckInCheckOutDto);
  }
}
