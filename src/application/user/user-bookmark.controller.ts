import {
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserBookmarkService } from './user-bookmark.service';
import { Roles } from '../access-control/decorators/role.decorator';
import { Role } from '../access-control/access-control.constant';
import { RoleGuard } from '../access-control/guards/role.guard';
import { BaseQueryDto } from 'src/common/dto';
import { AuthUser } from '../authentication/decorators/user.decorator';
import { User } from './entities/user.entity';

@Controller('v1')
export class UserBookmarkController {
  constructor(private userBookmarkService: UserBookmarkService) {}

  @Post('users/:userId/hotels/:hotelId')
  @Roles(Role.USER)
  @UseGuards(RoleGuard)
  create(@Param('hotelId') hotelId: string, @AuthUser() user: User) {
    return this.userBookmarkService.create(user.id, hotelId);
  }

  @Get('users/:userId/hotels/')
  @Roles(Role.USER)
  @UseGuards(RoleGuard)
  findUserId(@Query() query: BaseQueryDto, @AuthUser() user: User) {
    return this.userBookmarkService.find(user, query);
  }

  @Delete('users/:userId/hotels/:hotelId')
  @Roles(Role.USER)
  @UseGuards(RoleGuard)
  delete(
    @AuthUser() user: User,
    @Param('hotelId', ParseUUIDPipe) hotelId: string,
  ) {
    return this.userBookmarkService.delete({ userId: user.id, hotelId });
  }
}
