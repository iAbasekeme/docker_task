import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import * as moment from 'moment';
import { Transactional } from 'typeorm-transactional';
import { nanoid } from 'nanoid';
import { And, Between, FindOptionsWhere, In, IsNull, Not } from 'typeorm';
import { CreateBookingDto } from '../dto/create-booking.dto';
import { RoomService } from '../../room/room.service';
import { HotelService } from '../../hotel/hotel.service';
import { Booking, BookingStatus } from '../entities/booking.entity';
import { BookingRepository } from '../booking.repository';
import { BookedEvent } from '../event/booked.event';
import { RoomAvailabilityStatus } from '../../room/entities/room.entity';

@Injectable()
export class CreateBookingCommand {
  constructor(
    private roomService: RoomService,
    private hotelService: HotelService,
    private bookingRepository: BookingRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  async execute(createBookingDto: CreateBookingDto) {
    await this.validateBooking(createBookingDto);
    return await this.createBooking(createBookingDto);
  }

  async validateBooking(createBookingDto: CreateBookingDto) {
    const baseQuery: Partial<FindOptionsWhere<Booking>> = {
      hotelId: createBookingDto.hotelId,
      roomId: createBookingDto.roomId,
      status: And(
        Not(In([BookingStatus.approved, BookingStatus.cancelled])),
        Not(IsNull()),
      ),
    };
    const [roomOccupiedForSelectedDate, room] = await Promise.all([
      this.bookingRepository.findOne({
        where: [
          {
            ...baseQuery,
            expectedCheckInDate: Between(
              createBookingDto.expectedCheckInDate,
              createBookingDto.expectedCheckOutDate,
            ),
          },
          {
            ...baseQuery,
            expectedCheckOutDate: Between(
              createBookingDto.expectedCheckInDate,
              createBookingDto.expectedCheckOutDate,
            ),
          },
        ],
      }),
      this.roomService.findById(createBookingDto.roomId, []),
    ]);

    if (roomOccupiedForSelectedDate) {
      throw new ConflictException('room is not available for the selected day');
    }

    if (room.status === RoomAvailabilityStatus.occupied) {
      throw new ConflictException(
        'room is occupied, please contact hotel support',
      );
    }

    if (room.status === RoomAvailabilityStatus.outOfOrder) {
      throw new BadRequestException('room is out of order');
    }

    const checkInDateMoment = moment(createBookingDto.expectedCheckInDate);
    const checkOutDateMoment = moment(createBookingDto.expectedCheckOutDate);
    const checkInDateIsInThePast = moment().isAfter(checkInDateMoment);
    const checkOutDateIsInThePast = moment().isAfter(checkOutDateMoment);

    if (checkInDateIsInThePast || checkOutDateIsInThePast) {
      throw new BadRequestException(
        'check-in or check-out date cannot be in the past',
      );
    }

    if (checkInDateMoment.isSameOrAfter(checkOutDateMoment)) {
      throw new BadRequestException(
        'check-in date cannot be same or after check-out date',
      );
    }
  }

  @Transactional()
  async createBooking(createBookingDto: CreateBookingDto) {
    const [hotel, room] = await this.fetchHotelAndRoomOrThrow(
      createBookingDto.hotelId,
      createBookingDto.roomId,
    );
    const booking = new Booking();
    booking.guestName = createBookingDto.guestName;
    booking.guestPhoneNumberIntl = createBookingDto.guestPhoneNumberIntl;
    booking.guestEmail = createBookingDto.guestEmail;
    booking.country = createBookingDto.country;
    booking.numberOfOccupants = createBookingDto.numberOfOccupants || 1;
    booking.expectedCheckInDate = createBookingDto.expectedCheckInDate;
    booking.expectedCheckOutDate = createBookingDto.expectedCheckOutDate;
    booking.durationDays = moment(createBookingDto.expectedCheckOutDate).diff(
      moment(createBookingDto.expectedCheckInDate),
      'days',
    );
    (booking.hotelId = createBookingDto.hotelId),
      (booking.roomCategoryName = room.category.name);
    booking.roomCategoryId = room.category.id;
    booking.roomNumber = room.roomId;
    booking.roomId = room.id;
    booking.reservationType = createBookingDto.reservationType;
    booking.referenceId = nanoid(10);
    if (createBookingDto.userId) {
      booking.userId = createBookingDto.userId;
    }
    const createdBooking = await this.bookingRepository.save(booking);
    this.eventEmitter.emit(
      BookedEvent.eventName,
      new BookedEvent({ booking: createdBooking, hotel }),
    );
    return createdBooking;
  }

  private async fetchHotelAndRoomOrThrow(hotelId: string, roomId: string) {
    return await Promise.all([
      this.fetchHotelOrThrow(hotelId),
      this.fetchRoomOrThrow(roomId),
    ]);
  }

  private async fetchHotelOrThrow(hotelId: string) {
    const hotel = await this.hotelService.findOne({
      id: hotelId,
    });
    // check hotel verification, for now we don't want the app to be difficult to use
    if (!hotel) {
      throw new BadRequestException('hotel not found');
    }
    return hotel;
  }

  private async fetchRoomOrThrow(roomId: string) {
    const room = await this.roomService.findById(roomId, ['category']);
    if (!room) {
      throw new BadRequestException('room not found');
    }
    return room;
  }
}
