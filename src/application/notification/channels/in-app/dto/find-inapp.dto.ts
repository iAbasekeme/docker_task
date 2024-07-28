import { IsOptional, IsString } from 'class-validator';
import { BaseQueryDto } from 'src/common/dto';

export class FindInappNotificationDto extends BaseQueryDto {
  @IsString()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsOptional()
  hotelId?: string;

  @IsString()
  @IsOptional()
  hotelStaffId?: string;
}
