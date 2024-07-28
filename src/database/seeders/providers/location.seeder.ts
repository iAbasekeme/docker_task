import { Injectable, Logger } from '@nestjs/common';
import { streamValues } from 'stream-json/streamers/streamValues';
import { createReadStream } from 'fs';
import { parser } from 'stream-json';
import { chain } from 'stream-chain';
import { CountryRepository } from '../../../application/utility/location/country.repository';
import { CityRepository } from '../../../application/utility/location/city.repository';
import { StateRepository } from '../../../application/utility/location/state.repository';
import * as path from 'path';
import {
  resolvePointCoordinateFromLatLon,
  runConcurrently,
} from 'src/lib/utils.lib';
import { Country } from 'src/application/utility/location/entities/country.entity';
import { State } from 'src/application/utility/location/entities/state.entity';

@Injectable()
export class LocationSeeder {
  logger = new Logger(LocationSeeder.name);

  constructor(
    private countryRepository: CountryRepository,
    private cityRepository: CityRepository,
    private stateRepository: StateRepository,
  ) {}

  async seed() {
    const countries = (await fetchLargeJson(
      path.join(__dirname, '../data/countries.json'),
    )) as any[];
    const supportedCountriesStr = ['NG', 'GH'];
    const supportedCountries = countries.filter(
      (c) => c.iso2 && supportedCountriesStr.includes(c.iso2),
    );
    const countriesLookup: Record<string, Country> = {};
    await runConcurrently(
      supportedCountries as any,
      50,
      async (country: any) => {
        try {
          const saved = await this.countryRepository.save({
            name: country.name,
            iso3: country.iso3,
            iso2: country.iso2,
            numericCode: country.numeric_code,
            phoneCode: country.phone_code,
            capital: country.capital,
            currency: country.currency,
            currencyName: country.currency_name,
            currencySymbol: country.currency_symbol,
            timezones: country.timezones,
            coordinates: resolvePointCoordinateFromLatLon({
              longitude: country.longitude,
              latitude: country.latitude,
            }),
            emoji: country.emoji,
            emojiU: country.emojiU,
          });
          countriesLookup[country.iso2] = saved;
          return saved;
        } catch (error) {
          this.logger.log(error);
          throw error;
        }
      },
    );

    const statesLookup: Record<string, State> = {};
    const states = (await fetchLargeJson(
      path.join(__dirname, '../data/states.json'),
    )) as any[];
    const supportedStates = states.filter((state: any) =>
      supportedCountriesStr.includes(state.country_code),
    );
    await runConcurrently(supportedStates as any, 50, async (state: any) => {
      const country = countriesLookup[state.country_code];
      const saved = await this.stateRepository.save({
        name: state.name,
        countryId: country.id,
        coordinates: resolvePointCoordinateFromLatLon({
          longitude: state.longitude,
          latitude: state.latitude,
        }),
        countryCode: state.country_code,
        countryName: country.name,
        stateCode: state.state_code,
      });
      statesLookup[`${state.country_code}${state.state_code}`] = saved;
    });

    const cities = (await fetchLargeJson(
      path.join(__dirname, '../data/cities.json'),
    )) as any[];
    const supportedCities = cities.filter((c) =>
      supportedCountriesStr.includes(c.country_code),
    );
    await runConcurrently(supportedCities as any, 50, async (city: any) => {
      const state = statesLookup[`${city.country_code}${city.state_code}`];
      await this.cityRepository.save({
        name: city.name,
        stateId: state.id,
        coordinates: resolvePointCoordinateFromLatLon({
          longitude: city.longitude,
          latitude: city.latitude,
        }),
        stateCode: city.state_code,
        stateName: state.name,
        countryId: state.countryId,
        countryCode: state.countryCode,
        countryName: state.countryName,
      });
    });
  }
}

async function fetchLargeJson(filePath: string) {
  return await new Promise((resolve, reject) => {
    const pipeline = chain([
      createReadStream(filePath),
      parser(),
      streamValues(),
    ]);

    let data: any;
    pipeline.on('data', ({ value }) => {
      data = value;
    });

    pipeline.on('end', () => {
      console.log('Stream ended');
      resolve(data);
    });

    pipeline.on('error', (err) => {
      console.error('Stream error:', err);
      reject(err);
    });
  });
}
