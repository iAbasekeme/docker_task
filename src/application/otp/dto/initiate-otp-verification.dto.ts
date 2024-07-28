import { IsEmail, IsOptional } from 'class-validator';

export class InitiateOtpVerificationDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsEmail()
  @IsOptional()
  phoneNumberIntl?: string;
}
