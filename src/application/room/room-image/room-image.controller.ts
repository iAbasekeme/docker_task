import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
import { RoomImageService } from './room-image.service';
import { CreateRoomImageDto } from './dto/create-room-image.dto';
import { Roles } from '../../access-control/decorators/role.decorator';
import { Role } from '../../access-control/access-control.constant';
import { RoleGuard } from '../../access-control/guards/role.guard';
import { AuthUser } from '../../../application/authentication/decorators/user.decorator';
import { Person } from '../../../application/authentication/factories/person.factory';
import { validateHotelRequest } from '../../../common/validate-hotel-request.middleware';

@Controller()
export class RoomImageController {
  constructor(private readonly roomImageService: RoomImageService) {}

  @Post('v1/hotels/:hotelId/rooms/:roomId/images')
  @Roles(Role.HOTEL_STAFF)
  @UseGuards(RoleGuard)
  create(
    @Body() createRoomImageDto: CreateRoomImageDto,
    @Param('roomId') roomId: string,
    @Param('hotelId') hotelId: string,
    @AuthUser() person: Person,
  ) {
    validateHotelRequest(person, hotelId);
    return this.roomImageService.create(roomId, createRoomImageDto);
  }
}
