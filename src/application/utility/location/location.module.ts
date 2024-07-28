import { Module } from '@nestjs/common';
import { CountryRepository } from './country.repository';
import { StateRepository } from './state.repository';
import { CityRepository } from './city.repository';

@Module({
  providers: [CountryRepository, StateRepository, CityRepository],
  exports: [CountryRepository, StateRepository, CityRepository],
})
export class LocationModule {}
