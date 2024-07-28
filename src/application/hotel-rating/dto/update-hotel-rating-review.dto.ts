import { IsInt, IsOptional, IsString, Max, Min } from "class-validator";

export class UpdateHotelReviewRatingDto {
  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  rating?: number;

  @IsString()
  @IsOptional()
  review?: string;
}
