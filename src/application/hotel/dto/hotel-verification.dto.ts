import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class HotelVerificationDto {
  @IsString()
  @IsNotEmpty()
  affiliateCode: string;

  @IsString()
  @IsOptional()
  hotelId?: string;

  @IsString()
  @IsOptional()
  agentId?: string;
}
