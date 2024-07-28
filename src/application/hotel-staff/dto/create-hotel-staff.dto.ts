import { PartialType } from '@nestjs/mapped-types';
import { Allow, IsBoolean, IsOptional, IsString } from 'class-validator';
import { CreateUserDto } from '../../user/dto/create-user.dto';

export class CreateHotelStaffDto extends PartialType(CreateUserDto)  {
  @IsString()
  @IsOptional()
  hotelId?: string;

  @IsString()
  role: string;

  @IsBoolean()
  @IsOptional()
  shouldReceiveNotifications?: boolean;
}
