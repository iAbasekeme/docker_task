import { IsBoolean, IsNotEmpty, IsNumberString, IsOptional, IsString, Length } from 'class-validator';

export class CreateBankDetailDto {
  @IsString()
  @IsNotEmpty()
  accountName: string;

  @IsString()
  @IsNotEmpty()
  @Length(10, 16)
  accountNumber: string;

  @IsNumberString()
  @IsNotEmpty()
  bankSortCode: number;

  @IsString()
  @IsOptional()
  hotelId?: string;

  @IsString()
  @IsNotEmpty()
  otpId: string;

  @IsString()
  @IsNotEmpty()
  bankName: string;

  @IsBoolean()
  @IsOptional()
  default?: boolean
}
