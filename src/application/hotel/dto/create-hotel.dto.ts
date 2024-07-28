import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateHotelDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  ownerId?: string;

  @IsString({ each: true })
  @IsOptional()
  phoneNumbersIntl?: string[];

  @IsString()
  @IsOptional()
  affiliateToken?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsNumber()
  @IsOptional()
  longitude: number;

  @IsNumber()
  @IsOptional()
  latitude: number;

  @IsString()
  @IsOptional()
  cityId?: string;

  @IsString()
  @IsOptional()
  stateId?: string;

  @IsString()
  @IsOptional()
  countryId?: string;
}
