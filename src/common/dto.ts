import { IsNotEmpty, IsNumberString, IsOptional, IsString, Length } from 'class-validator';
import { VerifyOtpDto } from 'src/application/otp/dto/verify-otp.dto';

export class BaseQueryDto {
  @IsNumberString()
  @IsOptional()
  perPage?: number;

  @IsNumberString()
  @IsOptional()
  page?: number;

  @IsOptional()
  @IsString()
  sort?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  relations?: string;
}

export class ResetPasswordDto extends VerifyOtpDto {
  @IsNumberString()
  @Length(4, 4, { message: 'Pin must be 4 characters long' })
  password: string;
}

export class UpdatePasswordDto {
  @IsNumberString()
  @Length(4, 4, { message: 'Old Pin must be 4 characters long' })
  oldPassword: string;

  @IsNumberString()
  @Length(4, 4, { message: 'New Pin must be 4 characters long' })
  newPassword: string;
}

export class PasswordRequestDto {
  @IsString()
  @IsNotEmpty()
  password: string;
}
