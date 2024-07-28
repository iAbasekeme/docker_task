import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
  Query,
  Request,
  Logger,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Public } from '../authentication/decorators/public.decorator';
import { OptionalJwtAuthGuard } from '../authentication/guards/optional-jwt-auth.guard.ts';
import { RoleGuard } from '../access-control/guards/role.guard';
import { Roles } from '../access-control/decorators/role.decorator';
import { Role } from '../access-control/access-control.constant';
import { FindBookingDto } from './dto/find-booking.dto';
import { AuthUser } from '../authentication/decorators/user.decorator';
import {
  Person,
  RoleToAppMap,
} from '../authentication/factories/person.factory';
import { AuditBuilder } from '../audit/helpers/audit-builder.helper';
import { Apps } from 'src/common/types';
import { AuditPayload } from '../audit/audit.type';
import { Request as ExpressRequest } from 'express';
import { Booking } from './entities/booking.entity';
import { AuditService } from '../audit/audit.service';
import { validateHotelRequest } from '../../common/validate-hotel-request.middleware';

@Controller('v1')
export class BookingController {
  logger = new Logger(BookingController.name);
  constructor(
    private readonly bookingService: BookingService,
    private auditService: AuditService,
  ) {}

  @Post('bookings')
  @Public()
  @UseGuards(OptionalJwtAuthGuard)
  async create(
    @Body() createBookingDto: CreateBookingDto,
    @AuthUser() person: Person,
    @Request() req: ExpressRequest,
  ) {
    if (person) {
      createBookingDto.userId = person.id;
    }
    const booking = await this.bookingService.create(createBookingDto);
    await this.auditBooking(booking, person, { body: createBookingDto, req });
    return booking;
  }

  async auditBooking(
    booking: Booking,
    person: Person,
    requestContext: { body: CreateBookingDto; req: ExpressRequest },
  ) {
    try {
      const auditBuilder = AuditBuilder.init({
        operationType: 'new-booking',
        subjectId: person?.id || booking.guestEmail,
        subjectType: person?.role,
        action: 'create',
        targetApp: Apps.Hotel,
        targetId: booking.hotelId,
        sourceApp: RoleToAppMap[person?.role] || RoleToAppMap.USER,
        level: 'medium',
      } as AuditPayload);
      auditBuilder.setRequestContext(
        [{ type: 'body', data: requestContext.body }],
        requestContext.req.ip,
        person,
      );
      auditBuilder.setDecription(
        `Room ${booking.roomNumber} has been booked`,
        booking.guestName,
      );
      auditBuilder.setObject(booking.roomId, 'room');
      await this.auditService.create(auditBuilder);
    } catch (error) {
      this.logger.error('error auditing booking', error);
    }
  }

  @Get('hotels/:hotelId/bookings')
  @Roles(Role.HOTEL_STAFF)
  @UseGuards(RoleGuard)
  findHotelBookings(
    @Param('hotelId', ParseUUIDPipe) hotelId: string,
    @Query() query: FindBookingDto,
    @AuthUser() person: Person,
  ) {
    validateHotelRequest(person, hotelId);
    query.hotelId = hotelId;
    return this.bookingService.findAll(query);
  }

  @Get('bookings')
  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  findAll(@Query() query: FindBookingDto) {
    return this.bookingService.findAll(query);
  }

  @Get('users/:id/bookings')
  @Roles(Role.USER)
  @UseGuards(RoleGuard)
  findUserBookings(@Query() query: FindBookingDto, @AuthUser() person: Person) {
    query.userId = person.id;
    return this.bookingService.findAll(query);
  }

  @Get('bookings/:id')
  findOne(@Param('id', ParseUUIDPipe) bookingId: string) {
    return this.bookingService.findOne({ id: bookingId }, [
      'hotel',
      'room',
      'roomCategory',
    ]);
  }

  @Patch('/hotels/:hotelId/bookings/:id/approve')
  @Roles(Role.HOTEL_STAFF)
  @UseGuards(RoleGuard)
  approveBooking(
    @Param('id', ParseUUIDPipe) bookingId: string,
    @Param('hotelId') hotelId: string,
    @AuthUser() person: Person,
  ) {
    validateHotelRequest(person, hotelId);
    return this.bookingService.approveBooking(bookingId);
  }

  @Patch('/bookings/:id')
  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  update(
    @Param('id', ParseUUIDPipe) bookingId: string,
    @Body() updates: UpdateBookingDto,
  ) {
    return this.bookingService.update(bookingId, updates);
  }

  @Delete('/bookings/:id')
  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  remove(@Param('id', ParseUUIDPipe) bookingId: string) {
    return this.bookingService.remove(bookingId);
  }
}
