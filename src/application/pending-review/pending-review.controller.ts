import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { PendingReviewService } from './pending-review.service';
import { Roles } from '../access-control/decorators/role.decorator';
import { Role } from '../access-control/access-control.constant';
import { RoleGuard } from '../access-control/guards/role.guard';
import { AuthUser } from '../authentication/decorators/user.decorator';
import { User } from '../user/entities/user.entity';

@Controller('v1')
export class PendingReviewController {
  constructor(private pendingReviewService: PendingReviewService) {}

  @Get('pending-reviews')
  @Roles(Role.USER)
  @UseGuards(RoleGuard)
  list(@AuthUser() authUser: User) {
    return this.pendingReviewService.list(authUser.id);
  }

  @Delete('users/:id/pending-reviews')
  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  clearByUserId(@Param('id') userId: string) {
    return this.pendingReviewService.clear(userId);
  }

  @Delete('pending-reviews/:id')
  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  clearSingleForAdmin(@Param('id') pendingReviewId: string) {
    return this.pendingReviewService.use({
      id: pendingReviewId,
    });
  }

  @Delete('users/pending-reviews')
  @Roles(Role.USER)
  @UseGuards(RoleGuard)
  clear(@AuthUser() authUser: User) {
    return this.pendingReviewService.clear(authUser.id);
  }

  @Delete('users/pending-reviews/:id')
  @Roles(Role.USER)
  @UseGuards(RoleGuard)
  clearSingle(
    @AuthUser() authUser: User,
    @Param('id') pendingReviewId: string,
  ) {
    return this.pendingReviewService.use({
      userId: authUser.id,
      id: pendingReviewId,
    });
  }
}
