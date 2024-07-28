import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { isEmail } from 'class-validator';
import { CreateHotelStaffDto } from './dto/create-hotel-staff.dto';
import { HotelStaffRepository } from './hotel-staff.repository';
import { HotelStaff } from './entities/hotel-staff.entity';
import {
  HotelStaffCreatedEvent,
  HotelStaffCreatedEventPayload,
} from './events/hotel-staff-created.event';
import { HotelService } from '../hotel/hotel.service';
import {
  buildEntitySortObjectFromQueryParam,
  generateTokenChar,
  hashUtils,
} from '../../lib/utils.lib';
import { FindOptionsWhere } from 'typeorm';
import { omit } from 'ramda';
import { VerifyOtpDto } from '../otp/dto/verify-otp.dto';
import { OtpService } from '../otp/otp.service';
import { InitiateOtpVerificationDto } from '../otp/dto/initiate-otp-verification.dto';
import { NotificationService } from '../notification/notification.service';
import { Channel } from '../notification/notification.type';
import { ResetPasswordDto, UpdatePasswordDto } from '../../common/dto';
import { FindHotelStaffDto } from './dto/find-hotel-staff.dto';
import { PaginatedResult, Pagination } from 'src/lib/pagination.lib';
import { HotelStaffMapper } from './domain/hotel-staff.mapper';
import { UpdateHotelStaffDto } from './dto/update-hotel-staff.dto';

@Injectable()
export class HotelStaffService {
  logger = new Logger(HotelStaffService.name);
  constructor(
    private hotelStaffRepository: HotelStaffRepository,
    private hotelService: HotelService,
    private eventEmitter: EventEmitter2,
    private otpService: OtpService,
    private notificationService: NotificationService,
  ) {}

  async create(createHotelStaffDto: Omit<CreateHotelStaffDto, 'getPassword'>) {
    this.logger.log('creating unique staff for a hotel');
    createHotelStaffDto.email = createHotelStaffDto.email.toLowerCase();
    if (createHotelStaffDto?.username) {
      createHotelStaffDto.username = createHotelStaffDto.username
        .trim()
        .replace(/^@/, '')
        .replace(/\s+/, '_');
    }
    await this.validate(createHotelStaffDto.hotelId, createHotelStaffDto);
    return await this.hotelStaffRepository.save({
      ...createHotelStaffDto,
      role: createHotelStaffDto.role || 'member',
      password: await hashUtils.hash(createHotelStaffDto.password),
    });
  }

  private async validate(hotelId: string, createStaffDto: CreateHotelStaffDto) {
    const hotel = await this.hotelService.findOne({ id: hotelId });
    if (!hotel) {
      throw new BadRequestException('invalid hotel id');
    }

    const [emailExists, usernameExists] = await Promise.all([
      this.findOneByEmailOrUserName(createStaffDto.email),
      this.findOneByEmailOrUserName(createStaffDto.username),
    ]);

    if (emailExists) {
      throw new ConflictException('Email exists');
    }
    if (usernameExists) {
      throw new ConflictException('Username exists');
    }
  }

  @Transactional()
  async addStaffToHotel(hotelId: string, createStaffDto: CreateHotelStaffDto) {
    this.logger.log('Creating hotel staff user', { createStaffDto });
    const plainTextPassword = createStaffDto.password || generateTokenChar(4);
    const staff = await this.create({
      ...createStaffDto,
      password: plainTextPassword,
      hotelId,
    });
    const created = { ...staff };
    this.eventEmitter.emit(
      HotelStaffCreatedEvent.eventName,
      new HotelStaffCreatedEvent({
        ...created,
        password: plainTextPassword,
      } as HotelStaffCreatedEventPayload),
    );
    return omit(['password'], created);
  }

  async findOne(
    criteria: FindOptionsWhere<HotelStaff>[] | FindOptionsWhere<HotelStaff>,
  ) {
    return await this.hotelStaffRepository.findOne({
      where: criteria,
      relations: ['hotel'],
    });
  }

  async findOneByEmailOrUserName(emailOrUsername: string) {
    return await this.hotelStaffRepository.findOne({
      where: isEmail(emailOrUsername)
        ? { email: emailOrUsername.toLowerCase() }
        : { username: emailOrUsername },
      relations: ['hotel'],
    });
  }

  async initiateOtpVerification(otpDto: InitiateOtpVerificationDto) {
    const accountExists = await this.hotelStaffRepository.findOne({
      where: {
        email: otpDto.email.toLowerCase(),
      },
    });
    if (!accountExists) {
      throw new ForbiddenException('account does not exists');
    }
    return await this.otpService.initiateOtpVerification(otpDto);
  }

  async initiatePasswordReset(otpDto: InitiateOtpVerificationDto) {
    this.logger.log('initiating password reset', { email: otpDto.email });
    const accountExists = await this.hotelStaffRepository.findOne({
      where: {
        email: otpDto.email.toLowerCase(),
      },
    });
    if (!accountExists) {
      throw new ForbiddenException('account does not exists');
    }
    const otp = await this.otpService.create({ userId: otpDto.email });
    await this.notificationService.send({
      title: `Your password reset code is ${otp.plainTextCode}`,
      content: '',
      channels: [Channel.email],
      recipient: otpDto.email
        ? { email: otpDto.email }
        : { phoneNumber: otpDto.phoneNumberIntl },
      template: 'password-reset-initiate',
      sender: {
        name: 'tracman',
        id: 'mail@tracman.app',
      },
      metadata: {
        recipient: otpDto.email,
        otp: otp.plainTextCode,
        userReference: otp.userId,
        otpId: otp.id,
      },
    });
    return { success: true, expiresAt: otp.expiresAt, otpId: otp.id };
  }

  async resetPassword(dto: ResetPasswordDto) {
    this.logger.log('verifying password reset code');
    const verified = await this.otpService.verifyOtp(dto);
    if (verified.success) {
      this.logger.log('successfully verified password reset code');
      const otpData = verified.data;
      await this.hotelStaffRepository.update(
        { email: otpData.userId.toLowerCase() },
        { password: await hashUtils.hash(dto.password) },
      );
      return { success: true, message: 'password reset successful' };
    }
  }

  async verifyEmail(dto: VerifyOtpDto) {
    const verified = await this.otpService.verifyOtp(dto);
    if (verified.success) {
      const otpRecord = verified.data;
      await this.hotelStaffRepository.update(
        { email: otpRecord.userId },
        { isEmailVerified: true },
      );
      try {
        await this.hotelService.updateBy(
          { email: otpRecord.userId },
          { isEmailVerified: true },
        );
      } catch (error) {
        this.logger.error('error with updates', { error });
      }
      return { message: 'email verification successful' };
    }
  }

  async updatePassword(staffId: string, updates: UpdatePasswordDto) {
    const staff = await this.hotelStaffRepository.findOne({
      where: { id: staffId },
    });
    if (!staff) {
      throw new NotFoundException('staff not found');
    }
    const oldPasswordHashed = staff.password;
    const oldPasswordFromInputHashed = await hashUtils.hash(
      updates.oldPassword,
    );
    if (oldPasswordHashed === oldPasswordFromInputHashed) {
      await this.hotelStaffRepository.update(
        { id: staffId },
        { password: await hashUtils.hash(updates.newPassword) },
      );
      return { success: true, message: 'password updated successful' };
    }
    throw new ForbiddenException('password mismatch');
  }

  async findAll(dto: FindHotelStaffDto) {
    const pagination = new Pagination(dto.page, dto.perPage);
    const [result, total] = await this.hotelStaffRepository.findAndCount({
      where: HotelStaffMapper.toDB(dto),
      take: pagination.perPage,
      skip: pagination.skip,
      order: dto.sort
        ? buildEntitySortObjectFromQueryParam(dto.sort)
        : { createdAt: 'DESC' },
    });
    return PaginatedResult.create(result, total, pagination);
  }

  async delete(staffId: string) {
    const staff = await this.hotelStaffRepository.findOne({
      where: { id: staffId },
    });
    if (staff) {
      await this.hotelStaffRepository.delete({ id: staffId });
      return { message: 'Staff deleted', success: true };
    }
    return { message: 'Staff already deleted or not found' };
  }

  async update(id: string, edits: UpdateHotelStaffDto) {
    if (edits.password) {
      delete edits.password;
    }
    const staff = await this.hotelStaffRepository.findOne({
      where: { id: id },
    });
    if (staff) {
      await this.hotelStaffRepository.save({ id, ...edits });
      return { message: 'Staff updated', success: true };
    }
    return { message: 'No staff found for this ID' };
  }
}
