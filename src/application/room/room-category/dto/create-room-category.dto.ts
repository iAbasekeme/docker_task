import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateRoomCategoryDto {
  @IsString()
  @IsOptional()
  hotelId: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsNumber()
  @IsOptional()
  costAmount?: number;

  @IsString()
  @IsOptional()
  costCurrency?: string;

  @IsString({each: true})
  @IsOptional()
  images?: string[]
}
