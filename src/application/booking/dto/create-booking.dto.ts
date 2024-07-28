import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  guestName: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  guestPhoneNumberIntl: string;

  @IsEmail()
  @IsNotEmpty()
  guestEmail: string;

  @IsString()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsNotEmpty()
  hotelId: string;

  @IsString()
  country?: string;

  @IsNumber()
  @IsOptional()
  numberOfOccupants: number;

  @IsDateString()
  expectedCheckInDate: Date;

  @IsDateString()
  expectedCheckOutDate: Date;

  @IsString()
  @IsNotEmpty()
  roomId: string;

  @IsString()
  @IsOptional()
  reservationType: string;
}
