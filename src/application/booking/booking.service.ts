import { Not } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { CreateBookingCommand } from './domain/create-booking';
import { FindBookingDto } from './dto/find-booking.dto';
import { BookingRepository } from './booking.repository';
import { Booking, BookingStatus } from './entities/booking.entity';
import { ApproveBookingCommand } from './domain/approve-booking';
import { PaginatedResult, Pagination } from 'src/lib/pagination.lib';
import { BookingMapper } from './domain/booking-mapper';

@Injectable()
export class BookingService {
  constructor(
    private createBooking: CreateBookingCommand,
    private bookingRepository: BookingRepository,
    private approveBookingCommand: ApproveBookingCommand,
  ) {}

  async create(createBookingDto: CreateBookingDto) {
    return await this.createBooking.execute(createBookingDto);
  }

  async findAll(dto: FindBookingDto) {
    const { page, perPage } = dto || {};
    const pagination = new Pagination(page, perPage);
    const [list, total] = await this.bookingRepository.findAndCount({
      where: BookingMapper.toDB(dto),
      take: pagination.perPage,
      skip: pagination.skip,
    });
    return PaginatedResult.create(list, total, pagination);
  }

  async findOne(criteria: Partial<Booking>, relations?: string[]) {
    return await this.bookingRepository.findOne({ where: criteria, relations });
  }

  async update(
    id: string,
    updateBookingDto: UpdateBookingDto | Partial<Booking>,
  ) {
    return await this.bookingRepository.save({ id, ...updateBookingDto });
  }

  async remove(id: string) {
    return await this.bookingRepository.delete({ id });
  }

  async approveBooking(bookingId: string) {
    return await this.approveBookingCommand.execute(bookingId);
  }

  async count() {
    return await this.bookingRepository.count({
      where: { status: Not(BookingStatus.cancelled) },
    });
  }
}
