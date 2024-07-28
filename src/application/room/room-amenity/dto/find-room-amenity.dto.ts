import { IsOptional, IsString } from 'class-validator';
import { BaseQueryDto } from 'src/common/dto';

export class FindRoomAmenityDto extends BaseQueryDto {
  @IsString()
  @IsOptional()
  hotelId?: string;

  @IsString()
  @IsOptional()
  roomId?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  general?: string
}
