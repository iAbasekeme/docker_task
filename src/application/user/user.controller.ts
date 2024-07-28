import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  UseGuards,
  Patch,
  Param,
  ParseUUIDPipe,
  ForbiddenException,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserExistsDto } from './dto/user-exists.dto';
import { AuthUser } from '../authentication/decorators/user.decorator';
import { User } from './entities/user.entity';
import { Public } from '../authentication/decorators/public.decorator';
import { RoleGuard } from '../access-control/guards/role.guard';
import { Roles } from '../access-control/decorators/role.decorator';
import { Role } from '../access-control/access-control.constant';
import { UpdateUserDto } from './dto/update-user.dto';
import { Person } from '../authentication/factories/person.factory';
import { InitiateOtpVerificationDto } from '../otp/dto/initiate-otp-verification.dto';
import { ResetPasswordDto, UpdatePasswordDto } from 'src/common/dto';
import { FindUserDto } from './dto/find-user.dto';

@Controller('v1/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  findAll(@Query() filter: FindUserDto) {
    return this.userService.findAll(filter);
  }

  @Get('exists')
  @Public()
  exists(@Query() userExistsDto: UserExistsDto) {
    return this.userService.exists(userExistsDto);
  }

  @Patch(':id')
  @Roles(Role.USER)
  @UseGuards(RoleGuard)
  updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @Param('id', ParseUUIDPipe) userId: string,
    @AuthUser() authUser: Person,
  ) {
    const user = authUser as User;
    if (authUser.role !== Role.ADMIN && user.id !== userId) {
      throw new ForbiddenException(
        'you cannot update resource of another user',
      );
    }
    return this.userService.update({ id: userId }, updateUserDto);
  }

  @Get(':id')
  @Public()
  findById(@Param('id', ParseUUIDPipe) userId: string) {
    return this.userService.findOne({ id: userId });
  }

  @Post('password-reset/initiate')
  @Public()
  initiatePasswordReset(@Body() otp: InitiateOtpVerificationDto) {
    return this.userService.initiatePasswordReset(otp);
  }

  @Post('password-reset/verify')
  @Public()
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.userService.resetPassword(dto);
  }

  @Patch(':id/password')
  @Roles(Role.USER)
  @UseGuards(RoleGuard)
  updatePassword(
    @Param('id', ParseUUIDPipe) userId: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.userService.updatePassword(userId, updatePasswordDto);
  }

  @Delete(':id')
  @Roles(Role.USER)
  @UseGuards(RoleGuard)
  deleteUser(
    @Param('id', ParseUUIDPipe) userId: string) {
      return this.userService.deleteUser(userId);
    }
}
