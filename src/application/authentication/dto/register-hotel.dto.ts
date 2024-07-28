import { PartialType } from '@nestjs/mapped-types';
import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
} from 'class-validator';
import { CreateHotelDto } from 'src/application/hotel/dto/create-hotel.dto';

export class RegisterHotelDto extends PartialType(CreateHotelDto) {
  @IsString()
  @IsNotEmpty()
  @Length(3, Infinity, {
    message: 'Username must be at least 3 characters long',
  })
  hotelName: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsEmail()
  @IsNotEmpty()
  hotelEmail: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  phoneNumberIntl: string;

  @IsNumberString({ no_symbols: true }, { message: 'pin must be a string' })
  @Length(4, 4, { message: 'Pin must be 4 characters long' })
  password: string;

  @IsString()
  @IsOptional()
  username: string;

  @IsString()
  @IsOptional()
  affiliateToken?: string;
}
