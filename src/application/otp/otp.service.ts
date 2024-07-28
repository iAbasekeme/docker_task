import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import * as moment from 'moment';
import { Transactional } from 'typeorm-transactional';
import { CreateOtpDto } from './dto/create-otp.dto';
import { generateTokenNumeric, hashUtils } from '../../lib/utils.lib';
import { OtpRepository } from './otp.repository';
import { OTP_TTL_SECONDS } from '../../config/env.config';
import { NotificationService } from '../notification/notification.service';
import { Channel } from '../notification/notification.type';
import { InitiateOtpVerificationDto } from './dto/initiate-otp-verification.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Injectable()
export class OtpService {
  logger = new Logger(OtpService.name);
  constructor(
    private otpRepository: OtpRepository,
    private notificationService: NotificationService,
  ) {}

  private async hashOtp(otpCode: string) {
    return await hashUtils.hash(otpCode);
  }

  async create(createOtpDto: CreateOtpDto) {
    this.logger.log('create - generate and save otp - ', createOtpDto);
    const otpCode = generateTokenNumeric(6);
    const hashedCode = await this.hashOtp(otpCode);
    const expiresAt = moment().add(OTP_TTL_SECONDS, 'seconds');
    const reference = createOtpDto.reference;
    this.logger.log('create - generated code, hash and expiresAt - ', {
      otpCode,
      hashedCode,
      expiresAt,
      reference,
    });
    await this.invalidateOldOtps(createOtpDto.userId);
    const otp = await this.otpRepository.save({
      userId: createOtpDto.userId,
      expiresAt: expiresAt.toDate(),
      hashedCode,
      ...(createOtpDto.otpId ? { id: createOtpDto.otpId } : {}),
    });
    return { ...otp, plainTextCode: otpCode };
  }

  async initiateOtpVerification(
    otpDto: InitiateOtpVerificationDto,
    otpId?: string,
  ) {
    this.logger.log('initiateOtpVerification - data - ', otpDto);
    const otp = await this.create({
      userId: (otpDto.email || otpDto.phoneNumberIntl).toLowerCase(),
      otpId,
    });
    await this.notificationService.send({
      title: `Your OTP Code is ${otp.plainTextCode}`,
      content: '',
      channels: [otpDto.email ? Channel.email : Channel.sms],
      recipient: otpDto.email
        ? { email: otpDto.email }
        : { phoneNumber: otpDto.phoneNumberIntl },
      template: 'otp',
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
    return {
      expiresAt: otp.expiresAt,
      otpId: otp.id,
    };
  }

  async initiatePasswordResetOtp(otpDto: InitiateOtpVerificationDto) {
    this.logger.log('initiateOtpVerification - data - ', otpDto);
    const otp = await this.create({
      userId: (otpDto.email || otpDto.phoneNumberIntl).toLowerCase(),
    });
    await this.notificationService.send({
      title: `Your OTP Code is ${otp.plainTextCode}`,
      content: '',
      channels: [otpDto.email ? Channel.email : Channel.sms],
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
    return {
      expiresAt: otp.expiresAt,
      otpId: otp.id,
    };
  }

  @Transactional()
  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    this.logger.log('verifyOtp - ', verifyOtpDto);
    const otp = await this.otpRepository.findOne({
      where: {
        id: verifyOtpDto.otpId,
        isVerified: false,
      },
      order: { createdAt: 'DESC' },
      lock: {
        mode: 'pessimistic_partial_write',
      },
    });
    if (!otp) {
      throw new NotFoundException('otp not found or expired');
    }
    const hashedCode = await this.hashOtp(verifyOtpDto.otpCode);
    if (hashedCode !== otp.hashedCode) {
      throw new BadRequestException('invalid otp code');
    }
    const otpExpiresAt = moment(otp.expiresAt);
    const hasExpired = moment().isAfter(otpExpiresAt);
    if (hasExpired) {
      throw new BadRequestException('otp code has expired');
    }
    await this.otpRepository.save({
      id: otp.id,
      isVerified: true,
    });
    await this.invalidateOldOtps(otp.userId);
    return {
      success: true,
      message: 'Verification successful',
      data: {
        ...(await this.otpRepository.findOne({ where: { id: otp.id } })),
        otpId: otp.id,
      },
    };
  }

  async findVerified(userReference: string) {
    return await this.otpRepository.findOne({
      where: {
        userId: userReference,
        isVerified: true,
      },
    });
  }

  async validateOtpId(otpId: string) {
    const validOtpRecord = await this.otpRepository.findOne({
      where: { id: otpId },
    });
    if (validOtpRecord?.isVerified && !validOtpRecord?.isVerifiedUsed) {
      await this.otpRepository.update({ id: otpId }, { isVerifiedUsed: true });
      return true;
    }
    return false;
  }

  protected async invalidateOldOtps(userId: string) {
    this.logger.log('invalidateOldOtps - ', { userId });
    return await this.otpRepository.update(
      { userId, isVerified: false },
      {
        expiresAt: moment().subtract(5, 'seconds').toDate(),
      },
    );
  }
}
