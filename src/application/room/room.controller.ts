import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  Get,
  Query,
  Patch,
  Delete,
  Request,
  Logger,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { RoleGuard } from '../access-control/guards/role.guard';
import { Roles } from '../access-control/decorators/role.decorator';
import { Role } from '../access-control/access-control.constant';
import { Public } from '../authentication/decorators/public.decorator';
import { FindRoomDto } from './dto/find.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { AuthUser } from '../authentication/decorators/user.decorator';
import {
  Person,
  RoleToAppMap,
} from '../authentication/factories/person.factory';
import { Apps } from '../../common/types';
import { AuditPayload } from '../audit/audit.type';
import { Request as ExpressRequest } from 'express';
import { AuditService } from '../audit/audit.service';
import { Room, RoomAvailabilityStatus } from './entities/room.entity';
import { OptionalJwtAuthGuard } from '../authentication/guards/optional-jwt-auth.guard.ts';
import { validateHotelRequest } from 'src/common/validate-hotel-request.middleware';
import { capitalize } from 'src/lib/utils.lib';

@Controller('v1')
export class RoomController {
  logger = new Logger(RoomController.name);
  constructor(
    private readonly roomService: RoomService,
    private auditService: AuditService,
  ) {}

  @Post('hotels/:hotelId/rooms')
  @Roles(Role.HOTEL_STAFF)
  @UseGuards(RoleGuard)
  async create(
    @Body() createRoomDto: CreateRoomDto,
    @Param('hotelId') hotelId: string,
    @AuthUser() person: Person,
    @Request() req: ExpressRequest,
  ) {
    validateHotelRequest(person, hotelId);
    createRoomDto.hotelId = hotelId;
    const createdRoom = await this.roomService.create(createRoomDto);
    await this.auditRoomCreation(createdRoom, person, {
      req,
      params: { hotelId },
      body: createRoomDto,
    });
    return createdRoom;
  }

  private async auditRoomCreation(
    createdRoom: Room,
    person: Person,
    options: {
      req: ExpressRequest;
      params: { hotelId: string };
      body: CreateRoomDto;
    },
  ) {
    try {
      const { req, params, body } = options;
      await this.auditService.buildAndCreate({
        operationType: 'room-creation',
        action: 'create',
        subject: person,
        target: { app: Apps.Hotel, id: params.hotelId },
        sourceApp: RoleToAppMap[person.role],
        level: 'medium',
        description: {
          primary: `a room has been created by ${
            person.role === Role.ADMIN
              ? 'an admin'
              : capitalize(person.firstName)
          }`,
          secondary: createdRoom.roomId,
        },
        object: { type: 'room', id: createdRoom.roomId },
        state: createdRoom,
        requestContext: {
          req,
          context: [
            { type: 'body', data: body },
            { type: 'params', data: params },
          ],
        },
      });
    } catch (error) {
      this.logger.error('error auditing room creation', error);
    }
  }

  @Public()
  @Get('hotels/:id/rooms')
  findByHotel(@Param('id') hotelId: string, @Query() findRoomDto: FindRoomDto) {
    return this.roomService.find({ ...findRoomDto, hotelId });
  }

  @Get('rooms')
  @Public()
  @UseGuards(OptionalJwtAuthGuard)
  findAll(@Query() findRoomDto: FindRoomDto, @AuthUser() person: Person) {
    if (!person || person.role !== Role.ADMIN) {
      findRoomDto.status = RoomAvailabilityStatus.available;
    }
    return this.roomService.find(findRoomDto);
  }

  @Patch('hotels/:hotelId/rooms/:id')
  @Roles(Role.HOTEL_STAFF)
  @UseGuards(RoleGuard)
  async update(
    @Param('id') roomId: string,
    @Param('hotelId') hotelId: string,
    @Body() updates: UpdateRoomDto,
    @AuthUser() person: Person,
  ) {
    validateHotelRequest(person, hotelId);
    delete updates.hotelId;
    return this.roomService.update(roomId, updates);
  }

  @Delete('hotels/:hotelId/rooms/:roomId')
  @Roles(Role.HOTEL_STAFF)
  @UseGuards(RoleGuard)
  async delete(
    @Param('roomId') roomId: string,
    @Param('hotelId') hotelId: string,
    @AuthUser() person: Person,
  ) {
    validateHotelRequest(person, hotelId);
    return this.roomService.delete({ hotelId, id: roomId });
  }
}
