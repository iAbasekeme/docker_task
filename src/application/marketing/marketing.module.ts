import { Module, forwardRef } from '@nestjs/common';
import { MarketingAgentService } from './marketing.service';
import { MarketingAgentRepository } from './repository/agent.repository';
import { UserModule } from '../user/user.module';
import { MarketingController } from './marketing.controller';
import { AgentCreatedListener } from './listeners/agent-created.listener';
import { AgentAffiliateRepository } from './repository/agent-affiliate.repository';
import { OtpModule } from '../otp/otp.module';
import { NotificationModule } from '../notification/notification.module';
import { FeedbackRepository } from './repository/feedback.repository';
import { HotelModule } from '../hotel/hotel.module';

@Module({
  imports: [
    UserModule,
    OtpModule,
    NotificationModule,
    forwardRef(() => HotelModule),
  ],
  controllers: [MarketingController],
  providers: [
    MarketingAgentService,
    MarketingAgentRepository,
    AgentCreatedListener,
    AgentAffiliateRepository,
    FeedbackRepository,
  ],
  exports: [MarketingAgentService, MarketingAgentRepository],
})
export class MarketingAgentModule {}
