import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Patch,
  Delete,
  Request,
  Logger,
} from '@nestjs/common';
import { RoomCategoryService } from './room-category.service';
import { CreateRoomCategoryDto } from './dto/create-room-category.dto';
import { RoleGuard } from '../../access-control/guards/role.guard';
import { Roles } from '../../access-control/decorators/role.decorator';
import { Role } from '../../access-control/access-control.constant';
import { Public } from '../../authentication/decorators/public.decorator';
import { UpdateRoomCategoryDto } from './dto/update-room-category.dto';
import { validateHotelRequest } from '../../../common/validate-hotel-request.middleware';
import { AuthUser } from '../../../application/authentication/decorators/user.decorator';
import {
  Person,
  RoleToAppMap,
} from '../../../application/authentication/factories/person.factory';
import { Request as ExpressRequest } from 'express';
import { RoomCategory } from './entities/room-category.entity';
import { AuditBuilder } from 'src/application/audit/helpers/audit-builder.helper';
import { Apps } from 'src/common/types';
import { AuditPayload } from 'src/application/audit/audit.type';
import { AuditService } from 'src/application/audit/audit.service';
import { error } from 'console';

@Controller()
export class RoomCategoryController {
  logger = new Logger(RoomCategoryController.name);
  constructor(
    private readonly roomCategoryService: RoomCategoryService,
    private readonly auditService: AuditService,
  ) {}

  @Post('v1/hotels/:hotelId/room-categories')
  @UseGuards(RoleGuard)
  @Roles(Role.HOTEL_STAFF)
  async create(
    @Body() createRoomCategoryDto: CreateRoomCategoryDto,
    @Param('hotelId') hotelId: string,
    @AuthUser() person: Person,
    @Request() req: ExpressRequest,
  ) {
    validateHotelRequest(person, hotelId);
    createRoomCategoryDto.hotelId = hotelId;
    const category = await this.roomCategoryService.create(
      createRoomCategoryDto,
    );
    await this.auditRoomCategory(category, person, {
      body: createRoomCategoryDto,
      req,
    });
    return category
  }

  async auditRoomCategory(
    roomCategory: RoomCategory,
    person: Person,
    requestContext: { body: CreateRoomCategoryDto; req: ExpressRequest },
  ) {
    try {
      const auditBuilder = AuditBuilder.init({
        operationType: 'room-category-creation',
        subjectId: person?.id || roomCategory.hotelId,
        subjectType: person?.role,
        action: 'create',
        targetApp: Apps.Hotel,
        targetId: roomCategory.hotelId,
        sourceApp: RoleToAppMap[person?.role] || Apps.Hotel,
        level: 'medium',
      } as AuditPayload);
      auditBuilder.setRequestContext(
        [{ type: 'body', data: requestContext.body }],
        requestContext.req.ip,
        person,
      );
      auditBuilder.setDecription(
        `a room category with name ${roomCategory.name} has been added by ${
          person.role === Role.ADMIN ? 'an admin' : person.firstName
        }`,
        `${roomCategory.name}`,
      );
      auditBuilder.setObject(roomCategory.id, 'roomCategory');
      await this.auditService.create(auditBuilder);
    } catch (error) {
      this.logger.error(
        `error auditing roomCategory for hotel ${roomCategory.hotelId}`,
      );
    }
  }

  @Public()
  @Get('v1/hotels/:id/room-categories')
  findAll(@Param('id') hotelId: string) {
    return this.roomCategoryService.findAll({ hotelId });
  }

  @Patch('v1/hotels/:hotelId/room-categories/:id')
  @UseGuards(RoleGuard)
  @Roles(Role.HOTEL_STAFF)
  update(
    @Param('id') categoryId: string,
    @Body() updateRoomCategoryDto: UpdateRoomCategoryDto,
    @Param('hotelId') hotelId: string,
    @AuthUser() person: Person,
  ) {
    validateHotelRequest(person, hotelId);
    return this.roomCategoryService.update(categoryId, updateRoomCategoryDto);
  }

  @Delete('v1/hotels/:hotelId/room-categories/:id')
  @UseGuards(RoleGuard)
  @Roles(Role.HOTEL_STAFF)
  delete(
    @Param('id') categoryId: string,
    @Param('hotelId') hotelId: string,
    @AuthUser() person: Person,
  ) {
    validateHotelRequest(person, hotelId);
    return this.roomCategoryService.delete(categoryId);
  }
}
