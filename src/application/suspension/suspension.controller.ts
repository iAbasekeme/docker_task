import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { SuspensionService } from './suspension.service';
import { RoleGuard } from '../access-control/guards/role.guard';
import { Roles } from '../access-control/decorators/role.decorator';
import { Role } from '../access-control/access-control.constant';
import { CreateSuspensionDto } from './dto/create-suspension.dto';

@Controller('v1')
export class SuspensionController {
  constructor(private suspensionService: SuspensionService) {}

  @Post('hotels/:hotelId/suspensions')
  @Roles(Role.HOTEL_STAFF)
  @UseGuards(RoleGuard)
  toggleHotelSuspension(
    @Param('hotelId') hotelId: string,
    @Body() createSuspensionDto: CreateSuspensionDto,
  ) {
    return this.suspensionService.toggleHotelSuspension(
      hotelId,
      createSuspensionDto,
    );
  }
}
