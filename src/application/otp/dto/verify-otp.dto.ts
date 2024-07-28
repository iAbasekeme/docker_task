import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyOtpDto {
  @IsString()
  @IsNotEmpty()
  otpId: string

  @IsString()
  @IsNotEmpty()
  otpCode: string;
}
