import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminRepository } from './admin.repository';
import { UserModule } from '../user/user.module';
import { AdminController } from './admin.controller';
import { NotificationModule } from '../notification/notification.module';
import { OtpModule } from '../otp/otp.module';
import { HotelModule } from '../hotel/hotel.module';
import { InvitationModule } from '../invitation/invitation.module';
import { BookingModule } from '../booking/booking.module';

@Module({
  imports: [
    UserModule,
    NotificationModule,
    OtpModule,
    HotelModule,
    UserModule,
    BookingModule,
    InvitationModule,
  ],
  controllers: [AdminController],
  providers: [AdminService, AdminRepository],
  exports: [AdminService, AdminRepository],
})
export class AdminModule {}
