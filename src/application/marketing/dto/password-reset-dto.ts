import { IsString } from 'class-validator';
import { VerifyOtpDto } from '../../otp/dto/verify-otp.dto';

export class PasswordResetDto extends VerifyOtpDto {
  @IsString()
  newPassword: string;
}
