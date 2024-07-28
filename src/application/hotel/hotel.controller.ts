import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Request,
  Query,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { HotelService } from './hotel.service';
import { Roles } from '../access-control/decorators/role.decorator';
import { RoleGuard } from '../access-control/guards/role.guard';
import { Role } from '../access-control/access-control.constant';
import { HotelImageService } from './image/hotel-image.service';
import { CreateImageDto } from './image/create-image.dto';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { FindHotelDto } from './dto/find-hotel.dto';
import { Public } from '../authentication/decorators/public.decorator';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { HotelVerificationDto } from './dto/hotel-verification.dto';
import {
  Person,
  RoleToAppMap,
} from '../authentication/factories/person.factory';
import { Apps } from 'src/common/types';
import { AuthUser } from '../authentication/decorators/user.decorator';
import { OptionalJwtAuthGuard } from '../authentication/guards/optional-jwt-auth.guard.ts';
import { validateHotelRequest } from 'src/common/validate-hotel-request.middleware';
import { Hotel } from './entities/hotel.entity';
import { Request as ExpressRequest } from 'express';
import { AuditBuilder } from '../audit/helpers/audit-builder.helper';
import { AuditPayload } from '../audit/audit.type';
import { AuditService } from '../audit/audit.service';
import { capitalize } from 'src/lib/utils.lib';

@Controller('v1')
export class HotelController {
  logger = new Logger(HotelController.name);
  constructor(
    private readonly hotelService: HotelService,
    private readonly hotelImageService: HotelImageService,
    private readonly auditService: AuditService,
  ) {}

  @Post('hotels/:hotelId/images')
  @Roles(Role.HOTEL_STAFF)
  @UseGuards(RoleGuard)
  addImagesToHotel(
    @Param('hotelId') hotelId: string,
    @Body() imageDto: CreateImageDto,
    @AuthUser() person: Person,
  ) {
    validateHotelRequest(person, hotelId);
    return this.hotelImageService.create(hotelId, imageDto);
  }

  @Get('hotels/:id/images')
  @Public()
  findHotelImages(@Param('id') hotelId: string) {
    return this.hotelImageService.find(hotelId);
  }

  @Post('hotels')
  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  async createHotel(
    @Body() createHotelDto: CreateHotelDto,
    @AuthUser() person: Person,
    @Request() req: ExpressRequest,
  ) {
    const hotel = await this.hotelService.create(createHotelDto);
    this.auditHotel(hotel, person, { body: createHotelDto, req });
    return hotel;
  }

  async auditHotel(
    hotel: Hotel,
    person: Person,
    requestContext: { body: CreateHotelDto; req: ExpressRequest },
  ) {
    try {
      const auditBuilder = AuditBuilder.init({
        operationType: 'hotel-creation',
        subjectId: person?.id,
        subjectType: person?.role,
        action: 'create',
        targetApp: Apps.Admin,
        targetId: null,
        sourceApp: RoleToAppMap[person?.role] || Apps.Hotel,
        level: 'medium',
      } as AuditPayload);
      auditBuilder
        .setRequestContext(
          [{ type: 'body', data: requestContext.body }],
          requestContext.req.ip,
          person,
        )
        .setDecription(
          `A hotel ${capitalize(hotel.name)} has been created by ${capitalize(
            person.firstName,
          )}`,
          `${capitalize(hotel.name)}`,
        )
        .setObject(hotel.id, 'hotel');
      await this.auditService.create(auditBuilder);
    } catch (error) {
      this.logger.error('error auditing hotel', error);
    }
  }

  @Get('hotels')
  @Public()
  @UseGuards(OptionalJwtAuthGuard)
  findAll(@Query() findHotelDto: FindHotelDto, @AuthUser() person: Person) {
    if (!person || person.role !== Role.ADMIN) {
      findHotelDto.isVerified = 'true';
      findHotelDto.isActive = 'true';
    }
    const relations = findHotelDto?.relations || '';
    findHotelDto.relations = !relations?.includes('banks')
      ? `${relations},banks`
      : relations;
    return this.hotelService.findAll(findHotelDto);
  }

  @Get('hotels/:id')
  @Public()
  findById(@Param('id', ParseUUIDPipe) hotelId: string) {
    return this.hotelService.findOne({ id: hotelId }, [
      'images',
      'roomCategories',
      'banks',
    ]);
  }

  @Patch('hotels/:hotelId')
  @Roles(Role.HOTEL_STAFF)
  @UseGuards(RoleGuard)
  update(
    @Param('hotelId', ParseUUIDPipe) hotelId: string,
    @Body() updates: UpdateHotelDto,
    @AuthUser() person: Person,
  ) {
    validateHotelRequest(person, hotelId);
    return this.hotelService.updateById(hotelId, updates);
  }

  @Get('hotels/:hotelId/verifications/progress')
  @Roles(Role.HOTEL_STAFF, Role.MARKETING_AGENT)
  @UseGuards(RoleGuard)
  resolveVerificationStage(
    @Param('hotelId') hotelId: string,
    @AuthUser() person: Person,
  ) {
    validateHotelRequest(person, hotelId);
    return this.hotelService.resolveVerificationStages(hotelId);
  }

  @Patch('hotels/:id/verifications')
  @Roles(Role.HOTEL_STAFF, Role.MARKETING_AGENT)
  verifyHotel(
    @Param('id') hotelId: string,
    @Body() dto: HotelVerificationDto,
    @AuthUser() person: Person,
  ) {
    if (person.role === Role.MARKETING_AGENT) {
      dto.agentId = person.id;
    } else if (
      person.role === Role.HOTEL_STAFF ||
      person.role === Role.HOTEL_ADMIN
    ) {
      dto.agentId = null;
    }
    return this.hotelService.checkAndVerifyHotel(hotelId, dto);
  }
}
