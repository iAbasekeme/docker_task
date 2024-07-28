import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateSuspensionDto {
  @IsString()
  @IsOptional()
  reason?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  durationSeconds?: number;
}
