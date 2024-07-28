import { MiddlewareConsumer, Module } from '@nestjs/common';
import { RoomCategoryService } from './room-category.service';
import { RoomCategoryController } from './room-category.controller';
import { RoomCategoryRepository } from './room-category.repository';
import { ValidateHotelRequestMiddleware } from '../../../common/validate-hotel-request.middleware';

@Module({
  controllers: [RoomCategoryController],
  providers: [RoomCategoryService, RoomCategoryRepository],
  exports: [RoomCategoryService, RoomCategoryRepository],
})
export class RoomCategoryModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ValidateHotelRequestMiddleware)
      .forRoutes(RoomCategoryController);
  }
}
