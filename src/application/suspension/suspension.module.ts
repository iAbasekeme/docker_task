import { MiddlewareConsumer, Module } from '@nestjs/common';
import { HotelModule } from '../hotel/hotel.module';
import { HotelStaffModule } from '../hotel-staff/hotel-staff.module';
import { UserModule } from '../user/user.module';
import { MarketingAgentModule } from '../marketing/marketing.module';
import { SuspensionController } from './suspension.controller';
import { SuspensionService } from './suspension.service';
import { ValidateHotelRequestMiddleware } from 'src/common/validate-hotel-request.middleware';
import { SuspensionRepository } from './suspension.repository';

@Module({
  imports: [HotelModule, HotelStaffModule, UserModule, MarketingAgentModule],
  controllers: [SuspensionController],
  providers: [SuspensionService, SuspensionRepository],
})
export class SuspensionModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ValidateHotelRequestMiddleware)
      .forRoutes(SuspensionController);
  }
}
