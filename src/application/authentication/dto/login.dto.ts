import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { Apps } from 'src/common/types';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  emailOrUsername: string;

  @IsNumberString()
  @Length(4, 4, { message: 'Pin must be 4 characters long' })
  password: string;

  @Transform(({ value }) => ("" + value).toLowerCase())
  @IsEnum(Apps)
  @IsOptional()
  app?: Apps;
}
