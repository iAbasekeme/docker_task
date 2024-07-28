import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationModule } from './application/authentication/authentication.module';
import { UserModule } from './application/user/user.module';
import { OtpModule } from './application/otp/otp.module';
import { NotificationModule } from './application/notification/notification.module';
import { DatabaseModule } from './database/database.module';
import { datasource } from './config/env.config';
import { HotelModule } from './application/hotel/hotel.module';
import { HotelStaffModule } from './application/hotel-staff/hotel-staff.module';
import { ExceptionsFilter } from './lib/exceptions-filter.lib';
import { JwtGuard } from './application/authentication/guards/jwt.guard';
import { AccessControlModule } from './application/access-control/access-control.module';
import { AdminModule } from './application/admin/admin.module';
import { MarketingAgentModule } from './application/marketing/marketing.module';
import { RoomModule } from './application/room/room.module';
import { BookingModule } from './application/booking/booking.module';
import { ReviewRatingsModule } from './application/hotel-rating/hotel-rating.module';
import { CheckInCheckOutModule } from './application/check-in-check-out/check-in-check-out.module';
import { BankDetailModule } from './application/bank-details/bank-detail.module';
import { InvitationModule } from './application/invitation/invitation.module';
import { UtilityModule } from './application/utility/utility.module';
import { PendingReviewModule } from './application/pending-review/pending-review.module';
import { AuditModule } from './application/audit/audit.module';
import { SuspensionModule } from './application/suspension/suspension.module';

@Module({
  imports: [
    DatabaseModule.forRoot({ config: { datasource } }),
    EventEmitterModule.forRoot(),
    NotificationModule.forRoot(),
    ScheduleModule.forRoot(),
    AccessControlModule.forRoot(),
    AuditModule.register(),
    AuthenticationModule,
    UserModule,
    OtpModule,
    HotelModule,
    HotelStaffModule,
    AdminModule,
    MarketingAgentModule,
    RoomModule,
    BookingModule,
    ReviewRatingsModule,
    CheckInCheckOutModule,
    BankDetailModule,
    InvitationModule,
    UtilityModule,
    PendingReviewModule,
    SuspensionModule
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_FILTER, useClass: ExceptionsFilter },
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    AppService,
  ],
})
export class AppModule {}
