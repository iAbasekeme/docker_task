import { MiddlewareConsumer, Module } from '@nestjs/common';
import { HotelStaffService } from './hotel-staff.service';
import { HotelStaffController } from './hotel-staff.controller';
import { HotelStaffRepository } from './hotel-staff.repository';
import { UserModule } from '../user/user.module';
import { HotelModule } from '../hotel/hotel.module';
import { HotelStaffCreatedListener } from './listeners/hotel-staff-created.listener';
import { OtpModule } from '../otp/otp.module';
import { NotificationModule } from '../notification/notification.module';
import { ValidateHotelRequestMiddleware } from '../../common/validate-hotel-request.middleware';

@Module({
  imports: [UserModule, HotelModule, OtpModule, NotificationModule],
  controllers: [HotelStaffController],
  providers: [
    HotelStaffService,
    HotelStaffRepository,
    HotelStaffCreatedListener,
  ],
  exports: [HotelStaffService, HotelStaffRepository],
})
export class HotelStaffModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ValidateHotelRequestMiddleware)
      .forRoutes(HotelStaffController);
  }
}
