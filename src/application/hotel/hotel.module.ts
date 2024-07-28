import { MiddlewareConsumer, Module, forwardRef } from '@nestjs/common';
import { HotelService } from './hotel.service';
import { HotelController } from './hotel.controller';
import { HotelRepository } from './hotel.repository';
import { HotelImageModule } from './image/hotel-image.module';
import { ValidateHotelRequestMiddleware } from 'src/common/validate-hotel-request.middleware';
import { RoomModule } from '../room/room.module';
import { RoomCategoryModule } from '../room/room-category/room-category.module';
import { ResolveHotelVerificationStages } from './domain/resolve-hotel-verification-stages';
import { VerifyHotel } from './domain/verify-hotel';
import { MarketingAgentModule } from '../marketing/marketing.module';
import { RoomImageModule } from '../room/room-image/room-image.module';
import { LocationModule } from '../utility/location/location.module';

@Module({
  imports: [
    HotelImageModule,
    RoomModule,
    RoomImageModule,
    RoomCategoryModule,
    LocationModule,
    forwardRef(() => MarketingAgentModule),
  ],
  controllers: [HotelController],
  providers: [
    HotelService,
    HotelRepository,
    ResolveHotelVerificationStages,
    VerifyHotel,
  ],
  exports: [HotelService, HotelRepository],
})
export class HotelModule {}
