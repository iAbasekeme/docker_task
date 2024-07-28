import { IsString, Max, IsNotEmpty, IsNumberString } from 'class-validator';

export class ResolveAccountDto {
  @IsNumberString()
  @IsNotEmpty()
  accountNumber: string;

  @IsString()
  bankSortCode: string;
}
