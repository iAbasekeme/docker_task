import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { InAppNotificationService } from './in-app-notification.service';
import { FindInappNotificationDto } from './dto/find-inapp.dto';
import { Role } from '../../../access-control/access-control.constant';

@Controller('v1')
export class InAppNotificationController {
  constructor(private inappService: InAppNotificationService) {}

  @Get('users/:userId/notifications/inapp')
  findForUsers(
    @Param('userId', ParseUUIDPipe) userId: string,
    query: FindInappNotificationDto,
  ) {
    return this.inappService.find({
      ...query,
      personId: userId,
      personType: Role.USER,
    });
  }
}
