import { Module } from '@nestjs/common';
import { InvitationController } from './invitation.controller';
import { InvitationService } from './invitation.service';
import { NotificationModule } from '../notification/notification.module';
import { InvitationRepository } from './invitation.repository';

@Module({
  imports: [NotificationModule],
  controllers: [InvitationController],
  providers: [InvitationService, InvitationRepository],
  exports: [InvitationService]
})
export class InvitationModule {}
