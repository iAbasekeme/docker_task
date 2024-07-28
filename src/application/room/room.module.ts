import { MiddlewareConsumer, Module, forwardRef } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { RoomAmenityModule } from './room-amenity/room-amenity.module';
import { RoomImageModule } from './room-image/room-image.module';
import { RoomRepository } from './room.repository';
import { CreateRoomValidator } from './validators/create-room.validator';
import { ValidateHotelRequestMiddleware } from 'src/common/validate-hotel-request.middleware';
import { RoomCategoryModule } from './room-category/room-category.module';
import { HotelModule } from '../hotel/hotel.module';

@Module({
  controllers: [RoomController],
  providers: [RoomService, RoomRepository, CreateRoomValidator],
  imports: [
    RoomAmenityModule,
    RoomImageModule,
    RoomCategoryModule,
    forwardRef(() => HotelModule),
  ],
  exports: [RoomService, RoomRepository],
})
export class RoomModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ValidateHotelRequestMiddleware).forRoutes(RoomController);
  }
}
