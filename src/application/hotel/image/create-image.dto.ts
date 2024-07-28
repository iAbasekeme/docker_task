import { IsString } from 'class-validator';

export class CreateImageDto {
  @IsString({ each: true })
  urls: string[];
}
