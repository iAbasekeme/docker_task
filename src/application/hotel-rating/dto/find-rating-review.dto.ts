import { IsOptional, IsString } from 'class-validator';
import { BaseQueryDto } from 'src/common/dto';

export class FindRatingReviewDto extends BaseQueryDto {
  @IsString()
  @IsOptional()
  hotelId?: string;

  @IsString()
  @IsOptional()
  roomId?: string;
}
