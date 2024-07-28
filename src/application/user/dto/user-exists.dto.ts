import { IsNotEmpty, IsString } from 'class-validator';

export class UserExistsDto {
  @IsNotEmpty()
  @IsString()
  emailOrUsername: string;
}
