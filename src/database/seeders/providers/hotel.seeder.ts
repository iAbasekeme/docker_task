import { Injectable, Logger } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { HotelService } from '../../../application/hotel/hotel.service';
import { Hotel } from '../../../application/hotel/entities/hotel.entity';
import { generateTokenChar, getRandomItem } from '../../../lib/utils.lib';
import { CreateHotelDto } from '../../../application/hotel/dto/create-hotel.dto';
import { HotelStaffService } from '../../../application/hotel-staff/hotel-staff.service';
import { Gender } from '../../../common/types';
import { CreateHotelStaffDto } from '../../../application/hotel-staff/dto/create-hotel-staff.dto';
import { HotelImageService } from '../../../application/hotel/image/hotel-image.service';

@Injectable()
export class HotelSeeder {
  logger = new Logger(HotelSeeder.name);
  constructor(
    private hotelService: HotelService,
    private hotelStaffService: HotelStaffService,
    private hotelImageService: HotelImageService,
  ) {}

  async seed() {
    this.logger.log('seeding hotels');
    const hotels = this.fakeHotels;
    for (let hotel of hotels) {
      const createdHotel = await this.hotelService.create(hotel);
      const owner = await this.hotelStaffService.create({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: hotel.email,
        password: '1234',
        gender: getRandomItem([Gender.male, Gender.female, Gender.other]),
        role: 'owner',
        hotelId: createdHotel.id,
        username: `${faker.internet.userName()}-${generateTokenChar(4)}`,
      });
      await this.hotelService.updateById(createdHotel.id, {
        ownerId: owner.id,
      });
      await this.createStaffs(createdHotel);
      await this.createImages(createdHotel);
    }
  }

  private async createImages(hotel: Hotel) {
    const imageUrls = this.hotelImages;
    await this.hotelImageService.create(hotel.id, { urls: imageUrls });
  }

  private async createStaffs(hotel: Hotel) {
    const staffs = this.generateFakeStaffs();
    for (const staff of staffs) {
      await this.hotelStaffService.create({ ...staff, hotelId: hotel.id });
    }
  }

  private generateFakeStaffs() {
    const fakeStaffs: CreateHotelStaffDto[] = [];
    for (let count = 1; count <= 5; count++) {
      fakeStaffs.push({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: replaceEmailDomain(faker.internet.email()),
        password: '1234',
        gender: getRandomItem([Gender.male, Gender.female, Gender.other]),
        role: 'member',
        dateOfBirth: faker.date.birthdate(),
        username: `${faker.internet.userName()}-${generateTokenChar(4)}`,
        phoneNumberIntl: faker.phone.number(),
      });
    }
    return fakeStaffs;
  }

  private hotelImages = [
    'https://images.pexels.com/photos/261388/pexels-photo-261388.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',

    'https://images.pexels.com/photos/261395/pexels-photo-261395.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',

    'https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',

    'https://images.pexels.com/photos/1755288/pexels-photo-1755288.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',

    'https://images.pexels.com/photos/2290753/pexels-photo-2290753.jpeg?auto=compress&cs=tinysrgb&w=800&dpr=2',
  ];

  private fakeHotels: CreateHotelDto[] = [
    {
      name: faker.company.name(),
      email: replaceEmailDomain(faker.internet.email()),
      phoneNumbersIntl: [faker.phone.number()],
      address: faker.location.streetAddress(),
      longitude: 8.331106682436854,
      latitude: 4.997233613826253,
    },
    {
      name: faker.company.name(),
      email: replaceEmailDomain(faker.internet.email()),
      phoneNumbersIntl: [faker.phone.number()],
      address: faker.location.streetAddress(),
      longitude: 8.342162707119058,
      latitude: 4.98074062743369,
    },
    {
      name: faker.company.name(),
      email: replaceEmailDomain(faker.internet.email()),
      phoneNumbersIntl: [faker.phone.number()],
      address: faker.location.streetAddress(),
      longitude: 8.326453047215665,
      latitude: 4.975087532626048,
    },
    {
      name: faker.company.name(),
      email: replaceEmailDomain(faker.internet.email()),
      phoneNumbersIntl: [faker.phone.number()],
      address: faker.location.streetAddress(),
      longitude: 8.314198422852456,
      latitude: 4.951035439643633,
    },
    {
      name: faker.company.name(),
      email: replaceEmailDomain(faker.internet.email()),
      phoneNumbersIntl: [faker.phone.number()],
      address: faker.location.streetAddress(),
      longitude: 8.317315944086374,
      latitude: 4.931434185937263,
    },
    {
      name: faker.company.name(),
      email: replaceEmailDomain(faker.internet.email()),
      phoneNumbersIntl: [faker.phone.number()],
      address: faker.location.streetAddress(),
      longitude: 8.349600464659346,
      latitude: 4.945910474141513,
    },
    {
      name: faker.company.name(),
      email: replaceEmailDomain(faker.internet.email()),
      phoneNumbersIntl: [faker.phone.number()],
      address: faker.location.streetAddress(),
      longitude: 8.342510033412879,
      latitude: 5.006572875115211,
    },
    {
      name: faker.company.name(),
      email: replaceEmailDomain(faker.internet.email()),
      phoneNumbersIntl: [faker.phone.number()],
      address: faker.location.streetAddress(),
      longitude: 8.356291670376123,
      latitude: 5.043909324247991,
    },
    {
      name: faker.company.name(),
      email: replaceEmailDomain(faker.internet.email()),
      phoneNumbersIntl: [faker.phone.number()],
      address: faker.location.streetAddress(),
      longitude: 8.350016704809917,
      latitude: 5.034642761985282,
    },
    {
      name: faker.company.name(),
      email: replaceEmailDomain(faker.internet.email()),
      phoneNumbersIntl: [faker.phone.number()],
      address: faker.location.streetAddress(),
      longitude: 8.34638172348511,
      latitude: 4.970351273756108,
    },
    {
      name: faker.company.name(),
      email: replaceEmailDomain(faker.internet.email()),
      phoneNumbersIntl: [faker.phone.number()],
      address: faker.location.streetAddress(),
      longitude: 7.924968,
      latitude: 5.035848,
    },
    {
      name: faker.company.name(),
      email: replaceEmailDomain(faker.internet.email()),
      phoneNumbersIntl: [faker.phone.number()],
      address: faker.location.streetAddress(),
      longitude: 7.935688,
      latitude: 5.036963,
    },
    {
      name: faker.company.name(),
      email: replaceEmailDomain(faker.internet.email()),
      phoneNumbersIntl: [faker.phone.number()],
      address: faker.location.streetAddress(),
      longitude: 7.927847,
      latitude: 5.054536,
    },
    {
      name: faker.company.name(),
      email: replaceEmailDomain(faker.internet.email()),
      phoneNumbersIntl: [faker.phone.number()],
      address: faker.location.streetAddress(),
      longitude: 7.917068,
      latitude: 5.05431,
    },
    {
      name: faker.company.name(),
      email: replaceEmailDomain(faker.internet.email()),
      phoneNumbersIntl: [faker.phone.number()],
      address: faker.location.streetAddress(),
      longitude: 7.914768,
      latitude: 5.04995,
    },
    {
      name: faker.company.name(),
      email: replaceEmailDomain(faker.internet.email()),
      phoneNumbersIntl: [faker.phone.number()],
      address: faker.location.streetAddress(),
      longitude: 7.909536,
      latitude: 5.049678,
    },
  ];
}

function replaceEmailDomain(email: string) {
  if (typeof email !== 'string') {
    throw new Error('Invalid input: email must be a string');
  }

  const atIndex = email.indexOf('@');
  if (atIndex === -1) {
    throw new Error('Invalid email format: missing "@" character');
  }

  const localPart = email.slice(0, atIndex);
  const newDomain = 'mailinator.com';

  return `${localPart}@${newDomain}`;
}
