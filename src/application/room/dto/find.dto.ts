import { IsOptional, IsString } from 'class-validator';
import { BaseQueryDto } from '../../../common/dto';

export class FindRoomDto extends BaseQueryDto {
  @IsString()
  @IsOptional()
  hotelId?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  roomCategoryId: string;
}
