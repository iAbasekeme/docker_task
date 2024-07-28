import { Module } from '@nestjs/common';
import { RoomAmenityService } from './room-amenity.service';
import { RoomAmenityController } from './room-amenity.controller';
import { RoomAmenityRepository } from './room-amenity.repository';

@Module({
  controllers: [RoomAmenityController],
  providers: [RoomAmenityService, RoomAmenityRepository],
  exports: [RoomAmenityService, RoomAmenityRepository],
})
export class RoomAmenityModule {}
