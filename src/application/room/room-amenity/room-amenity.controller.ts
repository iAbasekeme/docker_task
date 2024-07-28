import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { RoomAmenityService } from './room-amenity.service';
import {
  CreateRoomAmenitiesDto,
  CreateRoomAmenityDto,
} from './dto/create-room-amenity.dto';
import { UpdateRoomAmenityDto } from './dto/update-room-amenity.dto';
import { RoleGuard } from '../../access-control/guards/role.guard';
import { Roles } from '../../access-control/decorators/role.decorator';
import { Role } from '../../access-control/access-control.constant';
import { Public } from '../../authentication/decorators/public.decorator';
import { FindRoomAmenityDto } from './dto/find-room-amenity.dto';
import { AuthUser } from '../../../application/authentication/decorators/user.decorator';
import { Person } from '../../../application/authentication/factories/person.factory';
import { validateHotelRequest } from '../../../common/validate-hotel-request.middleware';

@Controller('v1')
export class RoomAmenityController {
  constructor(private readonly roomAmenityService: RoomAmenityService) {}

  @Post('/hotels/:hotelId/rooms/:roomId/amenities')
  @UseGuards(RoleGuard)
  @Roles(Role.HOTEL_STAFF)
  create(
    @Body() createRoomAmenityDto: CreateRoomAmenityDto,
    @Param('hotelId', ParseUUIDPipe) hotelId: string,
    @Param('roomId', ParseUUIDPipe) roomId: string,
    @AuthUser() person: Person,
  ) {
    validateHotelRequest(person, hotelId);
    return this.roomAmenityService.create({
      ...createRoomAmenityDto,
      hotelId,
      roomId,
    });
  }

  @Post('/hotels/:hotelId/rooms/:roomId/amenities/bulk')
  @UseGuards(RoleGuard)
  @Roles(Role.HOTEL_STAFF)
  createBulk(
    @Body() dto: CreateRoomAmenitiesDto,
    @Param('hotelId', ParseUUIDPipe) hotelId: string,
    @Param('roomId', ParseUUIDPipe) roomId: string,
    @AuthUser() person: Person,
  ) {
    validateHotelRequest(person, hotelId);
    return this.roomAmenityService.createBulk(
      dto.list.map((a) => ({ ...a, roomId, hotelId })),
    );
  }

  @Post('/room-amenities')
  @UseGuards(RoleGuard)
  @Roles(Role.ADMIN)
  createGlobal(@Body() dto: CreateRoomAmenitiesDto) {
    return this.roomAmenityService.createBulk(dto.list);
  }

  @Get('/hotels/:hotelId/rooms/:roomId/amenities')
  @Public()
  findAll(
    @Query() findDto: FindRoomAmenityDto,
    @Param('roomId', ParseUUIDPipe) roomId: string,
    @Param('hotelId', ParseUUIDPipe) hotelId: string,
  ) {
    return this.roomAmenityService.findAll({ ...findDto, roomId, hotelId });
  }

  @Get('room-amenities')
  @Public()
  findGlobal(@Query() findDto: FindRoomAmenityDto) {
    return this.roomAmenityService.findAll(findDto, true);
  }

  @Patch('amenities/:id')
  @UseGuards(RoleGuard)
  @Roles(Role.ADMIN)
  update(
    @Body() updateRoomAmenityDto: UpdateRoomAmenityDto,
    @Param('id', ParseUUIDPipe) amenityId: string,
  ) {
    return this.roomAmenityService.update(amenityId, updateRoomAmenityDto);
  }

  @Delete('amenities/:id')
  @UseGuards(RoleGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id', ParseUUIDPipe) amenityId: string) {
    return this.roomAmenityService.remove(amenityId);
  }
}
