import { IsNumberString, IsOptional, IsString } from 'class-validator';
import { BaseQueryDto } from '../../../common/dto';

export class FindHotelDto extends BaseQueryDto {
  @IsString()
  @IsOptional()
  isVerified?: string;

  @IsString()
  @IsOptional()
  isActive?: string;

  @IsNumberString()
  @IsOptional()
  referenceLatitude?: string;

  @IsNumberString()
  @IsOptional()
  referenceLongitude?: string;

  @IsNumberString()
  @IsOptional()
  radiusInMeters?: string;

  @IsString()
  @IsOptional()
  countryId?: string;

  @IsString()
  @IsOptional()
  cityId?: string;

  @IsString()
  @IsOptional()
  stateId?: string;
}
