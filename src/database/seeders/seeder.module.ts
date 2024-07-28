import { Module } from '@nestjs/common';

import { AppModule } from '../../app.module';
import { HotelSeeder } from './providers/hotel.seeder';
import { RoomSeeder } from './providers/room.seeder';
import { HotelModule } from '../../application/hotel/hotel.module';
import { HotelStaffModule } from '../../application/hotel-staff/hotel-staff.module';
import { HotelImageModule } from '../../application/hotel/image/hotel-image.module';
import { RoomCategoryModule } from '../../application/room/room-category/room-category.module';
import { RoomModule } from '../../application/room/room.module';
import { RoomImageModule } from '../../application/room/room-image/room-image.module';
import { RoomAmenityModule } from '../../application/room/room-amenity/room-amenity.module';
import { Seeder } from './seeder';
import { LocationModule } from 'src/application/utility/location/location.module';
import { LocationSeeder } from './providers/location.seeder';

@Module({
  imports: [
    AppModule,
    HotelModule,
    HotelStaffModule,
    HotelImageModule,
    RoomCategoryModule,
    RoomModule,
    RoomImageModule,
    RoomAmenityModule,
    LocationModule,
  ],
  providers: [HotelSeeder, RoomSeeder, Seeder, LocationSeeder],
})
export class SeederModule {}
