import { PartialType } from '@nestjs/mapped-types';
import { RegisterDto } from './register.dto';
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ReserveAccountDto extends PartialType(RegisterDto) {
  @IsBoolean()
  @IsOptional()
  isHotelOwner?: boolean;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  hotelName?: string
}
