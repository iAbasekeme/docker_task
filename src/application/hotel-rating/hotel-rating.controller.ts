import {
  Controller,
  Post,
  Get,
  UseGuards,
  Query,
  Body,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { RatingsService } from './hotel-rating.service';
import { RoleGuard } from '../access-control/guards/role.guard';
import { CreateHotelRatingReviewDto } from './dto/create-hotel-rating-review.dto';
import { Roles } from '../access-control/decorators/role.decorator';
import { Role } from '../access-control/access-control.constant';
import { AuthUser } from '../authentication/decorators/user.decorator';
import { Person } from '../authentication/factories/person.factory';
import { UpdateHotelReviewRatingDto } from './dto/update-hotel-rating-review.dto';
import { FindRatingReviewDto } from './dto/find-rating-review.dto';
import { Public } from '../authentication/decorators/public.decorator';

@Controller('v1')
export class RatingsController {
  constructor(private readonly RatingsService: RatingsService) {}

  @Post('reviews')
  @Roles(Role.USER)
  @UseGuards(RoleGuard)
  create(
    @Body() createHotelRatingReviewDto: CreateHotelRatingReviewDto,
    @AuthUser() loggedInUser: Person,
  ) {
    createHotelRatingReviewDto.userId = loggedInUser.id;
    return this.RatingsService.create(createHotelRatingReviewDto);
  }

  @Delete('/reviews/:reviewId')
  @Roles(Role.USER)
  @UseGuards(RoleGuard)
  delete(
    @Param('reviewId') reviewId: string,
    @AuthUser() loggedInUser: Person,
  ) {
    return this.RatingsService.delete(reviewId);
  }

  @Get('hotels/:hotelId/reviews')
  @Public()
  findByHotelId(
    @Param('hotelId') hotelId: string,
    @Query() dto: FindRatingReviewDto,
  ) {
    dto.hotelId = hotelId;
    return this.RatingsService.find(dto, ['user', 'room', 'booking']);
  }

  @Get('rooms/:roomId/reviews')
  @Public()
  findByRoomId(
    @Param('roomId') roomId: string,
    @Query() dto: FindRatingReviewDto,
  ) {
    dto.roomId = roomId;
    return this.RatingsService.find(dto);
  }

  @Patch('/reviews/:reviewId')
  @Roles(Role.USER)
  @UseGuards(RoleGuard)
  update(
    @Body() UpdateHotelReviewRatingDto: UpdateHotelReviewRatingDto,
    @Param('reviewId') reviewId: string,
    @AuthUser() loggedInUser: Person,
  ) {
    return this.RatingsService.update(
      loggedInUser,
      reviewId,
      UpdateHotelReviewRatingDto,
    );
  }
}
