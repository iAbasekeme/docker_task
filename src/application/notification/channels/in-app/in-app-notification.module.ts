import { Module } from '@nestjs/common';
import { InAppNotificationService } from './in-app-notification.service';
import { InAppNotificationController } from './in-app-notification.controller';
import { InAppNotificationRepository } from './in-app-notification.repository';

@Module({
  providers: [InAppNotificationService, InAppNotificationRepository],
  controllers: [InAppNotificationController],
  exports: [InAppNotificationService, InAppNotificationRepository],
})
export class InAppNotificationModule {}
