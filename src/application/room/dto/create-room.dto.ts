import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { RoomAvailabilityStatus } from '../entities/room.entity';

export class CreateRoomDto {
  @IsString()
  @IsOptional()
  hotelId: string;

  @IsString()
  roomCategoryId: string;

  @IsNumber()
  capacity: number;

  @IsNumber()
  costAmount: number;

  @IsString()
  @IsNotEmpty()
  roomId: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  costCurrency: string = 'NGN';

  @IsEnum(RoomAvailabilityStatus)
  @IsOptional()
  status?: RoomAvailabilityStatus;

  @IsString()
  @IsOptional()
  bedType?: string;
}
