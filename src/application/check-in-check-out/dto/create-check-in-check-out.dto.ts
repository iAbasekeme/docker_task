import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CheckInCheckOutType } from '../entities/check-in-check-out.entity';

export class CreateCheckInCheckOutDto {
  @IsString()
  bookingId: string;

  @IsEnum(CheckInCheckOutType)
  @IsOptional()
  type?: CheckInCheckOutType;
}
