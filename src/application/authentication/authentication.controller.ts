import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticationService } from './authentication.service';
import { RegisterDto } from './dto/register.dto';
import { Public } from './decorators/public.decorator';
import { ReserveAccountDto } from './dto/reserve-account.dto';
import { RegisterHotelDto } from './dto/register-hotel.dto';
import { InitiateOtpVerificationDto } from '../otp/dto/initiate-otp-verification.dto';
import { VerifyOtpDto } from '../otp/dto/verify-otp.dto';
import { Hotel } from '../hotel/entities/hotel.entity';
import { Person, RoleToAppMap } from './factories/person.factory';
import { AuditBuilder } from '../audit/helpers/audit-builder.helper';
import { AuditService } from '../audit/audit.service';
import { Role } from '../access-control/access-control.constant';
import { Apps } from 'src/common/types';
import { AuditPayload } from '../audit/audit.type';
import { capitalize } from 'src/lib/utils.lib';

@Controller('v1')
@Public()
export class AuthenticationController {
  logger = new Logger(AuthenticationController.name);
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly auditService: AuditService,
  ) {}

  @Post('auth/register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() registerDto: RegisterDto) {
    return this.authenticationService.register(registerDto);
  }

  @Post('auth/register-hotel')
  @HttpCode(HttpStatus.CREATED)
  async registerHotel(
    @Body() registerDto: RegisterHotelDto,
    @Request() req: ExpressRequest,
  ) {
    const registered = await this.authenticationService.registerHotel(
      registerDto,
    );
    this.auditHotelRegisteration(
      registered.hotel,
      { ...registered, role: Role.HOTEL_ADMIN } as Person,
      {
        body: registerDto,
        req,
      },
    );
    return registered;
  }

  async auditHotelRegisteration(
    hotel: Hotel,
    person: Person,
    requestContext: { body: RegisterHotelDto; req: ExpressRequest },
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
          `A hotel ${capitalize(hotel.name)} has been registered by ${capitalize(
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

  @UseGuards(AuthGuard('local'))
  @HttpCode(HttpStatus.OK)
  @Post('auth/login')
  async login(@Request() req: any) {
    return this.authenticationService.login(req.user);
  }

  @Post('auth/reserved-accounts')
  reserverAccount(@Body() reserveAccountDto: ReserveAccountDto) {
    return this.authenticationService.reserveAccount(reserveAccountDto);
  }

  @Post('auth/otps/initiate')
  initiateOtpVerification(@Body() otp: InitiateOtpVerificationDto) {
    return this.authenticationService.initiateOtpVerification(otp);
  }

  @Post('auth/email-verifications')
  verifyUserEmail(@Body() dto: VerifyOtpDto) {
    return this.authenticationService.verifyUserEmail(dto);
  }

  @Post('auth/otps/verify')
  verifyOtp(@Body() otp: VerifyOtpDto) {
    return this.authenticationService.verifyOtp(otp);
  }
}
