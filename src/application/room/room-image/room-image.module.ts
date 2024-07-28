import { MiddlewareConsumer, Module } from '@nestjs/common';
import { RoomImageService } from './room-image.service';
import { RoomImageController } from './room-image.controller';
import { RoomImageRepository } from './room-image.repository';
import { ValidateHotelRequestMiddleware } from '../../../common/validate-hotel-request.middleware';

@Module({
  controllers: [RoomImageController],
  providers: [RoomImageService, RoomImageRepository],
  exports: [RoomImageService, RoomImageRepository],
})
export class RoomImageModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ValidateHotelRequestMiddleware)
      .forRoutes(RoomImageController);
  }
}
