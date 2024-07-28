import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { UserModule } from '../user/user.module';
import { UserRegisteredListener } from './listeners/user-registered.listener';
import { OtpModule } from '../otp/otp.module';
import { jwtConstants } from '../../config/env.config';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { HotelModule } from '../hotel/hotel.module';
import { HotelStaffModule } from '../hotel-staff/hotel-staff.module';
import { AccountReservedListener } from './listeners/account-reserved.listener';
import { AdminModule } from '../admin/admin.module';
import { MarketingAgentModule } from '../marketing/marketing.module';
import { PersonFactory } from './factories/person.factory';
import { HotelRegisteredListener } from './listeners/hotel-registered.listener';

@Module({
  imports: [
    AdminModule,
    UserModule,
    OtpModule,
    HotelModule,
    HotelStaffModule,
    MarketingAgentModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '400 days' },
    }),
  ],
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService,
    UserRegisteredListener,
    AccountReservedListener,
    HotelRegisteredListener,
    LocalStrategy,
    JwtStrategy,
    PersonFactory
  ],
  exports: [JwtStrategy],
})
export class AuthenticationModule {}
