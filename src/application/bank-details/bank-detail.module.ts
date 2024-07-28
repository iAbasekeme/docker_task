import { MiddlewareConsumer, Module } from '@nestjs/common';
import { BankDetailController } from './bank-detail.controller';
import { BankDetailService } from './bank-detail.service';
import { HotelModule } from '../hotel/hotel.module';
import { OtpModule } from '../otp/otp.module';
import { BankDetailRepository } from './bank-detail.repository';
import { ValidateHotelRequestMiddleware } from 'src/common/validate-hotel-request.middleware';

@Module({
  imports: [HotelModule, OtpModule],
  providers: [BankDetailService, BankDetailRepository],
  controllers: [BankDetailController],
  exports: [BankDetailService],
})
export class BankDetailModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ValidateHotelRequestMiddleware)
      .forRoutes(BankDetailController);
  }
}
