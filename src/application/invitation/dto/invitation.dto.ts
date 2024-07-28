import { IsArray, IsEmail, IsNotEmpty } from 'class-validator';

export class InvitationDto {
  @IsEmail({}, { each: true })
  @IsArray()
  @IsNotEmpty()
  emails: string[];
}

export class InvitationLinkDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
