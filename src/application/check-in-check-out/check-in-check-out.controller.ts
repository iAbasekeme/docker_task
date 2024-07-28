import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { CheckInCheckOutService } from './check-in-check-out.service';
import { CreateCheckInCheckOutDto } from './dto/create-check-in-check-out.dto';
import { Roles } from '../access-control/decorators/role.decorator';
import { RoleGuard } from '../access-control/guards/role.guard';
import { Role } from '../access-control/access-control.constant';

@Controller('v1')
export class CheckInCheckOutController {
  constructor(
    private readonly checkInCheckOutService: CheckInCheckOutService,
  ) {}

  @Post('check-ins')
  @Roles(Role.HOTEL_STAFF)
  @UseGuards(RoleGuard)
  checkIn(@Body() createCheckInCheckOutDto: CreateCheckInCheckOutDto) {
    return this.checkInCheckOutService.checkIn(createCheckInCheckOutDto);
  }

  @Post('check-outs')
  @Roles(Role.HOTEL_STAFF)
  @UseGuards(RoleGuard)
  checkOut(@Body() createCheckInCheckOutDto: CreateCheckInCheckOutDto) {
    return this.checkInCheckOutService.checkOut(createCheckInCheckOutDto);
  }

  @Post('cancelled-bookings')
  @Roles(Role.HOTEL_STAFF)
  @UseGuards(RoleGuard)
  cancel(@Body() createCheckInCheckOutDto: CreateCheckInCheckOutDto) {
    return this.checkInCheckOutService.cancel(createCheckInCheckOutDto);
  }
}
