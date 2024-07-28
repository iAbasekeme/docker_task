import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CreateUserDto } from 'src/application/user/dto/create-user.dto';

export class CreateAdminDto extends PartialType(CreateUserDto) {
  @IsString()
  @IsOptional()
  group: string;
}

export class CreateAdminByInviteDto extends CreateAdminDto {
  @IsNotEmpty()
  inviteId: string

  @IsNotEmpty()
  @IsEmail()
  email: string
}