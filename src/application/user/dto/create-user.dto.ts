import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
} from 'class-validator';
import { Gender } from '../../../common/types';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, Infinity, {
    message: 'Username must be at least 3 characters long',
  })
  username: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, Infinity, {
    message: 'First Name must be at least 3 characters long',
  })
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, Infinity, {
    message: 'Last Name must be at least 3 characters long',
  })
  lastName: string;

  @IsEmail()
  email: string;

  @IsNumberString()
  @Length(4, 4, { message: 'Pin must be 4 characters long' })
  password: string;

  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @IsDateString()
  @IsOptional()
  dateOfBirth?: Date;

  @IsPhoneNumber()
  @IsOptional()
  phoneNumberIntl?: string;
}
