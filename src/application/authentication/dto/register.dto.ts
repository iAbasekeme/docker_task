import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, Infinity, {
    message: 'Username must be at least 3 characters long',
  })
  username: string;

  @IsString()
  @IsOptional()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  phoneNumberIntl: string;

  @IsNumberString({ no_symbols: true }, { message: 'pin must be a string' })
  @Length(4, 4, { message: 'Pin must be 4 characters long' })
  password: string;
}
