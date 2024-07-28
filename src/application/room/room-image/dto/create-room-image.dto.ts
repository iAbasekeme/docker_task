import { IsString } from 'class-validator';

export class CreateRoomImageDto {
  @IsString({ each: true })
  urls: string[];
}
