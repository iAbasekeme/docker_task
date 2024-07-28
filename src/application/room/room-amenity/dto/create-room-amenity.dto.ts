import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateRoomAmenityDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  roomId?: string;

  @IsString()
  @IsOptional()
  hotelId?: string;
}

export class CreateRoomAmenitiesDto {
  @ValidateNested({ each: true })
  @Type(() => CreateRoomAmenityDto)
  @IsNotEmpty()
  list: CreateRoomAmenityDto[];
}
