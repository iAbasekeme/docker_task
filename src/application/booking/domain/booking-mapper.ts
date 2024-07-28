import { FindOptionsWhere, In } from 'typeorm';
import { CreateBookingDto } from '../dto/create-booking.dto';
import { FindBookingDto } from '../dto/find-booking.dto';
import { Booking } from '../entities/booking.entity';

export class BookingMapper {
  static toDB(dto: FindBookingDto | CreateBookingDto) {
    const dbQuery: FindOptionsWhere<Booking> = {};
    if (dto.guestEmail) {
      dbQuery.guestEmail = dto.guestEmail;
    }
    if (dto.hotelId) {
      dbQuery.hotelId = dto.hotelId;
    }
    if (dto.userId) {
      dbQuery.userId = dto.userId;
    }
    if ((<FindBookingDto>dto).status) {
      dbQuery.status = In((<FindBookingDto>dto).status.split(/\s*,\s*/));
    }
    return dbQuery;
  }
}
