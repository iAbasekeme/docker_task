import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  Query,
  Patch,
  Param,
  ParseUUIDPipe,
  Delete,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { Public } from '../authentication/decorators/public.decorator';
import { CreateAdminByInviteDto, CreateAdminDto } from './dto/create-admin.dto';
import { InitiateOtpVerificationDto } from '../otp/dto/initiate-otp-verification.dto';
import {
  BaseQueryDto,
  PasswordRequestDto,
  ResetPasswordDto,
  UpdatePasswordDto,
} from 'src/common/dto';
import { UserService } from '../user/user.service';
import { HotelService } from '../hotel/hotel.service';
import { Roles } from '../access-control/decorators/role.decorator';
import { Role } from '../access-control/access-control.constant';
import { RoleGuard } from '../access-control/guards/role.guard';
import { NewSignUpsDto } from '../user/dto/new-signups.dto';
import { BookingService } from '../booking/booking.service';
import { AuthUser } from '../authentication/decorators/user.decorator';
import { Person } from '../authentication/factories/person.factory';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Controller('v1')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly userService: UserService,
    private readonly hotelService: HotelService,
    private readonly bookingService: BookingService,
  ) {}

  @Post('admins')
  @Public()
  create(@Body() dto: CreateAdminDto) {
    return this.adminService.create(dto);
  }

  @Patch('admins/:id')
  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  update(
    @Body() dto: CreateAdminDto,
    @Param('id', ParseUUIDPipe) adminId: string,
  ) {
    return this.adminService.update(adminId, dto);
  }

  @Post('admins/invitations')
  @Public()
  createByInvitation(@Body() dto: CreateAdminByInviteDto) {
    return this.adminService.createByInvitation(dto);
  }

  @Post('admins/password-reset/initiate')
  @Public()
  initiatePasswordReset(@Body() otp: InitiateOtpVerificationDto) {
    return this.adminService.initiatePasswordReset(otp);
  }

  @Post('admins/password-reset/verify')
  @Public()
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.adminService.resetPassword(dto);
  }

  @Get('/summaries')
  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  async summary() {
    const [agentsCount, adminsCount, hotelsCount, bookingsCount] =
      await Promise.all([
        this.userService.count(),
        this.adminService.count(),
        this.hotelService.count(),
        this.bookingService.count(),
      ]);

    return {
      agentsCount,
      adminsCount,
      hotelsCount,
      bookingsCount,
    };
  }

  @Get('new-users')
  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  async newSignUps(@Query() newSignUpsDto: NewSignUpsDto) {
    return this.userService.newSignUps(newSignUpsDto);
  }

  @Get('users/summaries')
  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  findUsersSummary() {
    return this.adminService.findUsersSummary();
  }

  @Get('admins')
  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  find(@Query() query: BaseQueryDto) {
    return this.adminService.find(query);
  }

  @Get('admins/:id')
  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  findOne(@Param('id', ParseUUIDPipe) adminId: string) {
    return this.adminService.findOne({ id: adminId });
  }

  @Get('admins/:id')
  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  updateById(
    @Param('id', ParseUUIDPipe) adminId: string,
    @Body() updates: UpdateAdminDto,
  ) {
    return this.adminService.updateById(adminId, updates);
  }

  @Post('admins/:id/password')
  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  updatePassword(
    @Param('id', ParseUUIDPipe) adminId: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.adminService.updatePassword(adminId, updatePasswordDto);
  }

  @Delete('hotels/:id')
  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  deleteHotel(
    @Param('id', ParseUUIDPipe) hotelId: string,
    @Query() query: PasswordRequestDto,
    @AuthUser() person: Person,
  ) {
    return this.adminService.deleteHotel(hotelId, query, person);
  }

  @Delete('users/:id')
  @Roles(Role.ADMIN)
  @Public()
  deleteUser(
    @Param('id', ParseUUIDPipe) userId: string,
    @Query() query: PasswordRequestDto,
    @AuthUser() person: Person,
  ) {
    return this.adminService.deleteUser(userId, query, person);
  }

  @Patch('hotels/:id/approvals')
  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  approveHotel(
    @Param('id', ParseUUIDPipe) hotelId: string,
    @AuthUser() person: Person,
  ) {
    return this.adminService.approveHotel(hotelId, person);
  }
}
