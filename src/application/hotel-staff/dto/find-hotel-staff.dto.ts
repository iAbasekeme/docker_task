import { IsOptional, IsString } from 'class-validator';
import { BaseQueryDto } from 'src/common/dto';

export class FindHotelStaffDto extends BaseQueryDto {
  @IsString()
  @IsOptional()
  hotelId?: string;
}
