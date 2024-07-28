import {
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { omit } from 'ramda';
import { Transactional } from 'typeorm-transactional';
import { JwtService } from '@nestjs/jwt';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as uuid from 'uuid';

import { UserService } from '../user/user.service';
import { UserRegisteredEvent } from './events/user-registered.event';
import { RegisterDto } from './dto/register.dto';
import { hashUtils } from '../../lib/utils.lib';
import { AccessTokenPayload } from './types/access-token-payload.type';
import { ReserveAccountDto } from './dto/reserve-account.dto';
import { HotelService } from '../hotel/hotel.service';
import { HotelStaffService } from '../hotel-staff/hotel-staff.service';
import { AccountReservedEvent } from './events/account-reserved.event';
import { OtpService } from '../otp/otp.service';
import { RegisterHotelDto } from './dto/register-hotel.dto';
import { HotelRegisteredEvent } from './events/hotel-registered.event';
import { Apps } from '../../common/types';
import { Person, PersonFactory } from './factories/person.factory';
import { HotelStaff } from '../hotel-staff/entities/hotel-staff.entity';
import { User } from '../user/entities/user.entity';
import { CreateHotelDto } from '../hotel/dto/create-hotel.dto';
import { InitiateOtpVerificationDto } from '../otp/dto/initiate-otp-verification.dto';
import { VerifyOtpDto } from '../otp/dto/verify-otp.dto';

@Injectable()
export class AuthenticationService {
  logger = new Logger(AuthenticationService.name);
  constructor(
    private readonly userService: UserService,
    private readonly eventEmitter: EventEmitter2,
    private jwtService: JwtService,
    private hotelService: HotelService,
    private hotelStaffService: HotelStaffService,
    private otpService: OtpService,
    private personFactory: PersonFactory,
  ) {}

  @Transactional()
  async register(registerDto: RegisterDto) {
    this.logger.log(
      'register - registering - ',
      omit(['password'], registerDto),
    );
    if (!registerDto.firstName) {
      registerDto.firstName = '';
    }
    if (!registerDto.lastName) {
      registerDto.lastName = '';
    }
    const registered = await this.userService.create(registerDto);
    const otpId = uuid.v4();
    this.eventEmitter.emit(
      UserRegisteredEvent.eventName,
      new UserRegisteredEvent({ ...registered, otpId }),
    );
    return omit(['password'], { ...registered, otpId });
  }

  @Transactional()
  async registerHotel(registerHotelDto: RegisterHotelDto) {
    this.logger.log('Registering hotel with dto - ', registerHotelDto);
    const hotelStaff = await this.createHotelAndStaff(registerHotelDto);

    this.eventEmitter.emit(
      HotelRegisteredEvent.eventName,
      new HotelRegisteredEvent({
        hotel: hotelStaff.hotel,
        staff: hotelStaff,
        user: hotelStaff as any,
      }),
    );

    return omit(['password'], hotelStaff);
  }

  async validate(
    emailOrUserName: string,
    password: string,
    app?: Apps,
  ): Promise<Person> {
    const person = await this.personFactory.retrievePerson(
      emailOrUserName,
      app,
    );
    const isMatch: boolean = await hashUtils.compare(password, person.password);
    if (!isMatch) {
      throw new UnauthorizedException('Password does not match');
    }
    return person;
  }

  async login(person: Partial<Person>) {
    const payload: AccessTokenPayload = {
      email: person.email,
      sub: person.id,
      role: person.role,
    };
    return {
      accessToken: this.jwtService.sign(payload),
      role: person.role,
      person,
    };
  }

  private async createHotelAndStaff(
    registerHotelDto: RegisterHotelDto & { username: string },
  ) {
    const hotel = await this.hotelService.create({
      name: registerHotelDto.hotelName,
      email: registerHotelDto.hotelEmail,
      isVerified: false,
      longitude: registerHotelDto.longitude,
      latitude: registerHotelDto.latitude,
      address: registerHotelDto.address,
    } as CreateHotelDto);
    const person = await this.hotelStaffService.create({
      username: registerHotelDto.username || registerHotelDto.hotelEmail,
      email: registerHotelDto.hotelEmail,
      firstName: registerHotelDto.firstName,
      lastName: registerHotelDto.lastName,
      password: registerHotelDto.password,
      hotelId: hotel.id,
      role: 'owner',
      shouldReceiveNotifications: true,
    });
    await this.hotelService.updateById(hotel.id, { ownerId: person.id });
    person.hotel = hotel;
    return person;
  }

  @Transactional()
  async reserveAccount(reserveAccountDto: ReserveAccountDto) {
    this.logger.log('reserving account', reserveAccountDto);
    let person: HotelStaff | User;
    if (reserveAccountDto.isHotelOwner) {
      person = await this.createHotelAndStaff({
        hotelName: reserveAccountDto.hotelName,
        hotelEmail: reserveAccountDto.email,
        firstName: reserveAccountDto.firstName || '',
        lastName: reserveAccountDto.lastName || '',
        username: reserveAccountDto.username,
        password: Date.now() + '',
        phoneNumberIntl: reserveAccountDto.phoneNumberIntl || null,
      });
    } else {
      person = await this.userService.create({
        username: reserveAccountDto.username,
        email: reserveAccountDto.email,
        firstName: '',
        lastName: '',
        password: '' + Date.now(),
        isWaitlistUser: true,
      });
    }
    this.eventEmitter.emit(
      AccountReservedEvent.eventName,
      new AccountReservedEvent(person),
    );
    return person;
  }

  async initiateOtpVerification(otpDto: InitiateOtpVerificationDto) {
    const user = await this.userService.findOne({
      email: otpDto.email.toLowerCase(),
    });
    if (!user) {
      throw new ForbiddenException('account does not exists');
    }
    return await this.otpService.initiateOtpVerification(otpDto);
  }

  async verifyUserEmail(dto: VerifyOtpDto) {
    const verified = await this.otpService.verifyOtp(dto);
    if (verified.success) {
      const otpRecord = verified.data;
      await this.userService.update(
        { email: otpRecord.userId },
        { isEmailVerified: true },
      );
      return { message: 'email verification successful' };
    }
  }

  async verifyOtp(otp: VerifyOtpDto) {
    return await this.otpService.verifyOtp(otp);
  }
}
