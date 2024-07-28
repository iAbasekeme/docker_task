import { Injectable, Logger } from '@nestjs/common';
import { HotelSeeder } from './providers/hotel.seeder';
import { RoomSeeder } from './providers/room.seeder';
import { LocationSeeder } from './providers/location.seeder';

@Injectable()
export class Seeder {
  logger = new Logger(Seeder.name);
  seeders: Array<{ seed: () => Promise<unknown> }>;
  constructor(
    hotelSeeder: HotelSeeder,
    roomSeeder: RoomSeeder,
    locationSeeder: LocationSeeder,
  ) {
    this.seeders = [hotelSeeder, roomSeeder, locationSeeder];
  }

  async seed() {
    this.logger.log('Started process of seeding');
    for (const seeder of this.seeders) {
      await seeder.seed();
    }
  }
}
