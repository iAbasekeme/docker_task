import { IsEmail, IsOptional, IsString } from 'class-validator';
import { BaseQueryDto } from 'src/common/dto';
import { BookingStatus } from '../entities/booking.entity';

export class FindBookingDto extends BaseQueryDto {
  @IsEmail()
  @IsOptional()
  guestEmail?: string;

  @IsString()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsOptional()
  hotelId?: string;

  @IsString()
  @IsOptional()
  status?: string;
}
