import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  InternalServerErrorException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { omit } from 'ramda';
import { FindOptionsWhere } from 'typeorm';
import { isEmail } from 'class-validator';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './user.repository';
import { hashUtils } from '../../lib/utils.lib';
import { User } from './entities/user.entity';
import { UserExistsDto } from './dto/user-exists.dto';
import { InitiateOtpVerificationDto } from '../otp/dto/initiate-otp-verification.dto';
import { ResetPasswordDto, UpdatePasswordDto } from '../../common/dto';
import { OtpService } from '../otp/otp.service';
import { NewSignUpsDto } from '../user/dto/new-signups.dto';
import { FindUserDto } from './dto/find-user.dto';
import { deleteEntity } from 'src/common/repository-helpers/delete';

@Injectable()
export class UserService {
  logger = new Logger(UserService.name);
  constructor(
    private userRepository: UserRepository,
    private otpService: OtpService,
  ) {}

  async create(createUserDto: CreateUserDto | User) {
    this.logger.log(
      'creating user with attributes',
      omit(['password'], createUserDto),
    );
    return await this.createUniqueUser(createUserDto as CreateUserDto);
  }

  async findOneByEmailOrUserName(emailOrUsername: string) {
    return await this.userRepository.findOne({
      where: isEmail(emailOrUsername)
        ? { email: emailOrUsername.toLowerCase() }
        : { username: emailOrUsername },
    });
  }

  async findOne(
    where: Partial<
      Omit<User, 'toJSON' | 'normalizeEmail' | 'normalizeUserName'>
    >,
  ) {
    return this.userRepository.findOne({ where: { ...where } });
  }

  protected async createUniqueUser(createUserDto: CreateUserDto) {
    const userExists = await this.userRepository.findOne({
      where: [
        { email: createUserDto.email.toLowerCase() },
        { username: createUserDto.username },
      ],
    });
    if (userExists) {
      const duplicateFields = [];
      if (
        userExists.email.toLowerCase() === createUserDto.email.toLowerCase()
      ) {
        duplicateFields.push('email');
      }
      if (userExists.username === createUserDto.username) {
        duplicateFields.push('username');
      }
      this.logger.debug('createUniqueUser - conflict - dto - ', {
        dto: omit(['password'], createUserDto),
      });
      throw new ConflictException(
        `an account already exists with the provided ${duplicateFields.join(
          ' and ',
        )}`,
      );
    }
    if (createUserDto.password) {
      createUserDto.password = await hashUtils.hash(createUserDto.password);
    }
    createUserDto.email = createUserDto.email.toLowerCase();
    const createdUser = await this.userRepository.save(createUserDto);
    return omit(['password'], createdUser) as User;
  }

  async exists(userExistsDto: UserExistsDto) {
    const exists = await this.findOneByEmailOrUserName(
      userExistsDto.emailOrUsername,
    );
    const response = { exists: false };
    if (exists) {
      response.exists = true;
    }
    return response;
  }

  async update(criteria: FindOptionsWhere<User>, updates: Partial<User>) {
    const user = await this.userRepository.findOne({ where: criteria });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return await this.userRepository.save({
      ...omit(
        [
          'email',
          'password',
          'isActive',
          'isWaitlistUser',
          'isEmailVerified',
          'isPhoneNumberVerified',
        ],
        updates,
      ),
      id: user.id,
    });
  }

  async initiatePasswordReset(otpDto: InitiateOtpVerificationDto) {
    if (!otpDto.email && !otpDto.phoneNumberIntl) {
      throw new BadRequestException('one of email or phone number is required');
    }
    const accountExists = await this.userRepository.findOne({
      where: { email: otpDto.email.toLowerCase() },
    });
    if (!accountExists) {
      throw new ForbiddenException('account does not exists');
    }
    return this.otpService.initiatePasswordResetOtp(otpDto);
  }

  async resetPassword(passwordResetDto: ResetPasswordDto) {
    const verified = await this.otpService.verifyOtp({
      otpCode: passwordResetDto.otpCode,
      otpId: passwordResetDto.otpId,
    });
    if (verified) {
      const verifiedOtpData = verified.data;
      await this.userRepository.update(
        { email: verifiedOtpData.userId },
        { password: await hashUtils.hash(passwordResetDto.password) },
      );
      return { success: true, message: 'password reset successful' };
    }
    throw new BadRequestException('password reset unsuccessful');
  }

  async count() {
    return await this.userRepository.count();
  }

  async newSignUpsCount() {
    return await this.userRepository.newSignUpsCount();
  }

  async newSignUps(queries: NewSignUpsDto) {
    try {
      this.logger.log(`Load users - filter by >>`, { queries });
      return await this.userRepository.newSignUps(queries);
    } catch (error) {
      throw new InternalServerErrorException(error.message || error);
    }
  }

  async findAll(dto: FindUserDto) {
    return await this.userRepository.findAll(dto);
  }

  async updatePassword(userId: string, updates: UpdatePasswordDto) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    this.logger.log(
      'oldpassword hashed',
      user.password,
      'old password',
      updates.oldPassword,
      'new password',
      updates.newPassword,
    );
    if (await hashUtils.compare(updates.oldPassword, user.password)) {
      await this.userRepository.update(
        { id: userId },
        { password: await hashUtils.hash(updates.newPassword) },
      );
      return { success: true, message: 'password updated successfully' };
    }
    throw new ForbiddenException('password mismatch');
  }

  async deleteUser(userId: string) {
    try {
      await deleteEntity(this.userRepository, userId);
      return { success: true, message: 'deleted successfully' }
    } catch (error) {
      this.logger.error('could not delete user', { userId, error });
      throw error;
    }
  }
}
