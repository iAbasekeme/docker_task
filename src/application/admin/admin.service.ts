import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { AdminRepository } from './admin.repository';
import { Admin } from './entities/admin.entity';
import { isEmail } from 'class-validator';
import { CreateAdminDto, CreateAdminByInviteDto } from './dto/create-admin.dto';
import { Transactional } from 'typeorm-transactional';
import {
  buildEntitySortObjectFromQueryParam,
  hashUtils,
} from 'src/lib/utils.lib';
import { FindOptionsWhere, ILike } from 'typeorm';
import { omit } from 'ramda';
import { InitiateOtpVerificationDto } from '../otp/dto/initiate-otp-verification.dto';
import { OtpService } from '../otp/otp.service';
import {
  BaseQueryDto,
  PasswordRequestDto,
  ResetPasswordDto,
  UpdatePasswordDto,
} from 'src/common/dto';
import { HotelService } from '../hotel/hotel.service';
import { UserService } from '../user/user.service';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { PaginatedResult, Pagination } from 'src/lib/pagination.lib';
import { BookingService } from '../booking/booking.service';
import { InvitationService } from '../invitation/invitation.service';
import { Person } from '../authentication/factories/person.factory';
import { verifyPerson } from 'src/common/repository-helpers/verify-person';
import { deleteEntity } from 'src/common/repository-helpers/delete';
import { HotelRepository } from '../hotel/hotel.repository';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class AdminService {
  logger = new Logger(AdminService.name);
  constructor(
    private readonly adminRepository: AdminRepository,
    private otpService: OtpService,
    private hotelService: HotelService,
    private userService: UserService,
    private bookingService: BookingService,
    private invitationService: InvitationService,
    private hotelRepository: HotelRepository,
    private userRepository: UserRepository,
  ) {}

  async findOne(where: FindOptionsWhere<Admin> | FindOptionsWhere<Admin>[]) {
    return await this.adminRepository.findOne({ where });
  }

  async updateById(id: string, updates: Partial<Admin>) {
    return await this.adminRepository.save({ id, ...updates });
  }

  async validate(createAdminDto: CreateAdminDto) {
    const [emailExists, usernameExists] = await Promise.all([
      this.adminRepository.findOne({
        where: { email: createAdminDto.email.toLowerCase() },
      }),
      this.adminRepository.findOne({
        where: { username: createAdminDto.username },
      }),
    ]);
    if (emailExists) {
      throw new ConflictException('email exists');
    }
    if (usernameExists) {
      throw new ConflictException('username exists');
    }
  }

  async createByInvitation(dto: CreateAdminByInviteDto) {
    await this.invitationService.useInvitation(dto);
    delete dto.inviteId;
    return await this.create(dto);
  }

  @Transactional()
  async create(createAdminDto: CreateAdminDto) {
    createAdminDto.email = createAdminDto.email.toLowerCase();
    await this.validate(createAdminDto);
    createAdminDto.password = await hashUtils.hash(createAdminDto.password);
    const created = await this.adminRepository.save({
      ...createAdminDto,
      group: createAdminDto.group,
    });
    return omit(['password'], created);
  }

  async update(id: string, updates: UpdateAdminDto) {
    return await this.adminRepository.save({ id, ...updates });
  }

  async findOneByEmailOrUserName(emailOrUsername: string) {
    return await this.adminRepository.findOne({
      where: isEmail(emailOrUsername)
        ? { email: emailOrUsername.toLowerCase() }
        : { username: emailOrUsername },
    });
  }

  async initiatePasswordReset(otpDto: InitiateOtpVerificationDto) {
    if (!otpDto.email && !otpDto.phoneNumberIntl) {
      throw new BadRequestException('one of email or phone number is required');
    }
    const accountExists = await this.adminRepository.findOne({
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
      await this.adminRepository.update(
        { email: verifiedOtpData.userId },
        { password: await hashUtils.hash(passwordResetDto.password) },
      );
      return { success: true, message: 'password reset successful' };
    }
    throw new BadRequestException('password reset unsuccessful');
  }

  async count() {
    return await this.adminRepository.count();
  }

  async findUsersSummary() {
    const [allUsersCount, hotelsCount, newUsersCount, bookingsCount] =
      await Promise.all([
        this.userService.count(),
        this.hotelService.count(),
        this.userService.newSignUpsCount(),
        this.bookingService.count(),
      ]);
    return {
      allUsersCount,
      hotelsCount,
      newUsersCount,
      bookingsCount,
    };
  }

  async find(query: BaseQueryDto) {
    const { page, perPage, search, sort } = query || {};
    const pagination = new Pagination(page, perPage);
    const [list, total] = await this.adminRepository.findAndCount({
      where: search
        ? [
            { firstName: ILike(`%${search}%`) },
            { lastName: ILike(`%${search}%`) },
            { firstName: ILike(`%${search}%`) },
            { email: ILike(`%${search}%`) },
          ]
        : {},
      order: sort
        ? buildEntitySortObjectFromQueryParam(sort)
        : { createdAt: 'DESC' },
    });
    return PaginatedResult.create(list, total, pagination);
  }

  async updatePassword(adminId: string, updates: UpdatePasswordDto) {
    const admin = await this.adminRepository.findOne({
      where: { id: adminId },
    });
    if (!admin) {
      throw new NotFoundException('admin not found');
    }
    const oldPasswordHashed = admin.password;
    const oldPasswordFromInputHashed = await hashUtils.hash(
      updates.oldPassword,
    );
    if (oldPasswordHashed === oldPasswordFromInputHashed) {
      await this.adminRepository.update(
        { id: adminId },
        { password: await hashUtils.hash(updates.newPassword) },
      );
      return { success: true, message: 'password updated successful' };
    }
    throw new ForbiddenException('password mismatch');
  }

  async deleteHotel(
    hotelId: string,
    deleteHotelDto?: PasswordRequestDto,
    authUser?: Person,
  ) {
    try {
      if (authUser && deleteHotelDto?.password) {
        await verifyPerson(
          this.adminRepository,
          { id: authUser.id },
          deleteHotelDto.password,
          'password',
        );
      }
    } catch (error) {
      this.logger.error('error verifying admin password');
      throw error;
    }

    try {
      await deleteEntity(this.hotelRepository, hotelId);
      return { success: true, message: 'deleted successfully' };
    } catch (error) {
      this.logger.error('Could not delete hotel', { hotelId, error });
      throw error;
    }
  }

  async deleteUser(
    userId: string,
    deleteUserDto: PasswordRequestDto,
    authUser: Person,
  ) {
    try {
      if (authUser && deleteUserDto?.password) {
        await verifyPerson(
          this.userRepository,
          { id: authUser.id },
          deleteUserDto.password,
          'password',
        );
      }
    } catch (error) {
      this.logger.error('error verifying user password');
      throw error;
    }

    try {
      await deleteEntity(this.userRepository, userId);
      return { success: true, message: 'successfully deleted' };
    } catch (error) {
      this.logger.error('Could not delete user', { userId, error });
      throw error;
    }
  }

  async approveHotel(hotelId: string, authUser?: Person) {}
}
