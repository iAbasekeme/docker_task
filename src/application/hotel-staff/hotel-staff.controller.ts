import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Patch,
  Query,
  Delete,
  Request,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { HotelStaffService } from './hotel-staff.service';
import { Roles } from '../access-control/decorators/role.decorator';
import { Role } from '../access-control/access-control.constant';
import { RoleGuard } from '../access-control/guards/role.guard';
import { CreateHotelStaffDto } from './dto/create-hotel-staff.dto';
import {
  Person,
  RoleToAppMap,
} from '../authentication/factories/person.factory';
import { AuthUser } from '../authentication/decorators/user.decorator';
import { VerifyOtpDto } from '../otp/dto/verify-otp.dto';
import { InitiateOtpVerificationDto } from '../otp/dto/initiate-otp-verification.dto';
import { ResetPasswordDto, UpdatePasswordDto } from '../../common/dto';
import { Public } from '../authentication/decorators/public.decorator';
import { FindHotelStaffDto } from './dto/find-hotel-staff.dto';
import { UpdateHotelStaffDto } from './dto/update-hotel-staff.dto';
import { HotelStaff } from './entities/hotel-staff.entity';
import { Request as ExpressRequest } from 'express';
import { AuditService } from '../audit/audit.service';
import {
  validateHotelRequest,
  validateHotelStaffRequest,
} from 'src/common/validate-hotel-request.middleware';
import { AuditBuilder } from '../audit/helpers/audit-builder.helper';
import { Apps } from 'src/common/types';
import { AuditPayload } from '../audit/audit.type';

@Controller('v1')
export class HotelStaffController {
  logger = new Logger(HotelStaffController.name)
  constructor(private readonly hotelStaffService: HotelStaffService,
    private readonly auditService: AuditService
  ) {}

  @Post('hotels/:hotelId/staffs')
  @Roles(Role.HOTEL_ADMIN)
  @UseGuards(RoleGuard)
  async create(
    @Body() hotelStaffDto: CreateHotelStaffDto,
    @Param('hotelId') hotelId: string,
    @AuthUser() loggedInUser: Person,
    @Request() req: ExpressRequest,
  ) {
    validateHotelRequest(loggedInUser, hotelId);
    const createdStaff = await this.hotelStaffService.addStaffToHotel(hotelId, hotelStaffDto);
    await this.auditHotelStaffCreation(createdStaff, loggedInUser, {
      req,
      params: { hotelId },
      body: hotelStaffDto,
    });
    return createdStaff;
  }

  private async auditHotelStaffCreation(
    createdStaff: Partial<HotelStaff>,
    person: Person,
    options: {
      req: ExpressRequest;
      params: { hotelId: string };
      body: CreateHotelStaffDto;
    },
  ) {
    try {
      const { req, params, body } = options;
      const auditBuilder = AuditBuilder.init({
        operationType: 'hotel-staff-creation',
        subjectId: person.id,
        subjectType: person.role,
        action: 'create',
        targetApp: Apps.Hotel,
        targetId: params.hotelId,
        sourceApp: RoleToAppMap[person.role],
        subDescription: createdStaff.id,
        level: 'medium',
      } as AuditPayload);
      auditBuilder
        .setRequestContext(
          [
            { type: 'body', data: body },
            { type: 'params', data: params },
          ],
          req.ip,
          person,
        )
        .setDecription(`an hotel-staff has been created`, createdStaff.id)
        .setState(createdStaff, null)
        .setObject(createdStaff.id, 'staff');
      await this.auditService.create(auditBuilder)
    } catch (error) {
      this.logger.error('error auditing hotel staff creation', error)
    }
  }

  @Post('hotel-staffs/otps')
  @Public()
  initiateOtpVerification(@Body() otp: InitiateOtpVerificationDto) {
    return this.hotelStaffService.initiateOtpVerification(otp);
  }

  @Post('hotel-staffs/password-reset/initiate')
  @Public()
  initiatePasswordReset(@Body() otp: InitiateOtpVerificationDto) {
    return this.hotelStaffService.initiatePasswordReset(otp);
  }

  @Post('hotel-staffs/password-reset/verify')
  @Public()
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.hotelStaffService.resetPassword(dto);
  }

  @Post('hotels/auth/email-verifications')
  @Public()
  verifyUserEmail(@Body() dto: VerifyOtpDto) {
    return this.hotelStaffService.verifyEmail(dto);
  }

  @Patch('hotel-staffs/:id/password')
  @Roles(Role.HOTEL_STAFF)
  @UseGuards(RoleGuard)
  updatePassword(
    @Param('id', ParseUUIDPipe) staffId: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.hotelStaffService.updatePassword(staffId, updatePasswordDto);
  }

  @Get('hotels/:hotelId/staffs')
  @Roles(Role.HOTEL_STAFF)
  @UseGuards(RoleGuard)
  findByHotelId(
    @Query() query: FindHotelStaffDto,
    @Param('hotelId') hotelId: string,
    @AuthUser() person: Person,
  ) {
    validateHotelRequest(person, hotelId);
    query.hotelId = hotelId;
    return this.hotelStaffService.findAll(query);
  }

  @Patch('hotel-staffs/:id')
  @Roles(Role.HOTEL_STAFF)
  @UseGuards(RoleGuard)
  update(
    @Body() dto: UpdateHotelStaffDto,
    @Param('id', ParseUUIDPipe) hotelStaffId: string,
  ) {
    return this.hotelStaffService.update(hotelStaffId, dto);
  }

  @Delete('hotel-staffs/:id')
  @Roles(Role.HOTEL_STAFF)
  @UseGuards(RoleGuard)
  delete(
    @Param('id', ParseUUIDPipe) staffId: string,
    @AuthUser() person: Person,
  ) {
    validateHotelStaffRequest(person, staffId);
    return this.hotelStaffService.delete(staffId);
  }
}
