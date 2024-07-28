import { faker } from '@faker-js/faker';
import { Injectable, Logger } from '@nestjs/common';
import { Hotel } from '../../../application/hotel/entities/hotel.entity';
import { HotelService } from '../../../application/hotel/hotel.service';
import { RoomCategory } from '../../../application/room/room-category/entities/room-category.entity';
import { RoomCategoryRepository } from '../../../application/room/room-category/room-category.repository';
import { RoomService } from '../../../application/room/room.service';
import { RoomImageService } from '../../../application/room/room-image/room-image.service';
import { getRandomItem } from '../../../lib/utils.lib';
import { Room } from '../../../application/room/entities/room.entity';
import { RoomAmenityService } from '../../../application/room/room-amenity/room-amenity.service';

@Injectable()
export class RoomSeeder {
  logger = new Logger(RoomSeeder.name);
  constructor(
    private hotelService: HotelService,
    private roomCategoryRepository: RoomCategoryRepository,
    private roomService: RoomService,
    private roomImageService: RoomImageService,
    private roomAmenityService: RoomAmenityService,
  ) {}

  async seed() {
    const paginatedHotels = await this.hotelService.findAll({});
    const totalPages = paginatedHotels.metadata.pages;
    await this.createRoomsAndCategoriesForHotel(paginatedHotels.result);
    for (let page = 2; page <= totalPages; page += 1) {
      const paginatedHotels = await this.hotelService.findAll({ page: page });
      await this.createRoomsAndCategoriesForHotel(paginatedHotels.result);
    }
  }

  private async createRoomsAndCategoriesForHotel(hotels: Hotel[]) {
    const categories = this.categories;
    await this.createGlobalAmenities();
    for (let hotel of hotels) {
      const createdCategories = await this.roomCategoryRepository.save(
        categories.map((c) => ({ ...c, hotelId: hotel.id })),
      );
      let roomNumber = getRandomItem([100, 200, 300, 400, 500]);
      for (const category of createdCategories) {
        await this.createRoomsAmenitiesAndImages(category, hotel, roomNumber);
        roomNumber += 1;
      }
    }
  }

  private async createRoomsAmenitiesAndImages(
    category: RoomCategory,
    hotel: Hotel,
    roomNumber: number,
  ) {
    const createdRoom = await this.roomService.create({
      hotelId: hotel.id,
      roomCategoryId: category.id,
      description: category.description,
      capacity: 1,
      roomId: `${roomNumber}`,
      costAmount: category.costAmount,
      costCurrency: category.costCurrency,
      bedType: 'large',
    });
    await this.roomImageService.create(createdRoom.id, {
      urls: this.roomImages,
    });
    await this.createRoomAmenities(hotel, createdRoom);
  }

  async createGlobalAmenities() {
    await this.roomAmenityService.createBulk(
      this.roomAmenities.map((amenityName) => ({ name: amenityName })),
    );
  }

  async createRoomAmenities(hotel: Hotel, room: Room) {
    await this.roomAmenityService.createBulk(
      getRandomItem(this.groupedRoomAmenities).map((amenityName) => ({
        name: amenityName,
        roomId: room.id,
        hotelId: hotel.id,
      })),
    );
  }

  private groupedRoomAmenities = [
    [
      // Comfort and Sleep
      'High-quality bedding and linens',
      'Extra pillows and blankets',
      'Blackout curtains',
    ],
    [
      // Bathroom
      'Plush towels',
      'Bathrobes and slippers',
      'Complimentary toiletries (shampoo, conditioner, soap, lotion)',
      'Hairdryer',
      'Makeup/shaving mirror',
    ],
    [
      // In-room Entertainment
      'Flat-screen TV with cable/satellite channels',
      'Streaming services (Netflix, Hulu, etc.)',
      'Bluetooth speaker or radio',
    ],
    [
      // Food and Beverage
      'Mini-bar or mini-fridge',
      'Coffee maker or kettle with complimentary coffee and tea',
      'Complimentary bottled water',
      'Room service menu',
    ],
    [
      // Technology and Connectivity
      'Free Wi-Fi',
      'USB charging ports',
      'In-room safe',
      'Telephone',
    ],

    [
      // Workspace
      'Desk and chair',
      'Desk lamp',
    ],

    [
      // Climate Control
      'Air conditioning and heating controls',
    ],

    [
      // Storage and Convenience
      'Wardrobe or closet with hangers',
      'Iron and ironing board',
      'Luggage rack',
    ],

    [
      // Security
      'In-room safe',
      'Electronic key card access',
    ],

    [
      // Additional Comforts
      'Welcome amenities (fruit basket, chocolates, etc.)',
      'Local area guidebooks and magazines',
    ],
  ];

  private roomAmenities = [
    // Comfort and Sleep
    'High-quality bedding and linens',
    'Extra pillows and blankets',
    'Blackout curtains',

    // Bathroom
    'Plush towels',
    'Bathrobes and slippers',
    'Complimentary toiletries (shampoo, conditioner, soap, lotion)',
    'Hairdryer',
    'Makeup/shaving mirror',

    // In-room Entertainment
    'Flat-screen TV with cable/satellite channels',
    'Streaming services (Netflix, Hulu, etc.)',
    'Bluetooth speaker or radio',

    // Food and Beverage
    'Mini-bar or mini-fridge',
    'Coffee maker or kettle with complimentary coffee and tea',
    'Complimentary bottled water',
    'Room service menu',

    // Technology and Connectivity
    'Free Wi-Fi',
    'USB charging ports',
    'In-room safe',
    'Telephone',

    // Workspace
    'Desk and chair',
    'Desk lamp',

    // Climate Control
    'Air conditioning and heating controls',

    // Storage and Convenience
    'Wardrobe or closet with hangers',
    'Iron and ironing board',
    'Luggage rack',

    // Security
    'In-room safe',
    'Electronic key card access',

    // Additional Comforts
    'Welcome amenities (fruit basket, chocolates, etc.)',
    'Local area guidebooks and magazines',
  ];

  private roomImages = [
    'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/279746/pexels-photo-279746.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/262048/pexels-photo-262048.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  ];

  private categories: Omit<RoomCategory, 'hotelId'>[] = [
    {
      name: 'Single Room',
      description:
        'A cozy room designed for one person, featuring a single bed and essential amenities for a comfortable stay.',
      costAmount: Number(
        faker.finance.amount({
          min: 10000,
          max: 50000,
          symbol: '',
          autoFormat: false,
        }),
      ),
      costCurrency: 'NGN',
    },
    {
      name: 'Double Room',
      description:
        'A spacious room ideal for two people, equipped with a double bed or two single beds, and all necessary facilities.',
      costAmount: Number(
        faker.finance.amount({
          min: 10000,
          max: 50000,
          symbol: '',
          autoFormat: false,
        }),
      ),
      costCurrency: 'NGN',
    },
    {
      name: 'Triple Room',
      description:
        'Perfect for small families or groups, this room includes three single beds or a combination of beds to accommodate three guests.',
      costAmount: Number(
        faker.finance.amount({
          min: 10000,
          max: 50000,
          symbol: '',
          autoFormat: false,
        }),
      ),
      costCurrency: 'NGN',
    },

    {
      name: 'Quadruple Room',
      description:
        'A large room designed to comfortably house four guests, typically featuring multiple bed configurations.',
      costAmount: Number(
        faker.finance.amount({
          min: 10000,
          max: 50000,
          symbol: '',
          autoFormat: false,
        }),
      ),
      costCurrency: 'NGN',
    },

    {
      name: 'Standard Room',
      description:
        'A well-appointed room offering a balance of comfort and value, equipped with standard amenities for a pleasant stay.',
      costAmount: Number(
        faker.finance.amount({
          min: 10000,
          max: 50000,
          symbol: '',
          autoFormat: false,
        }),
      ),
      costCurrency: 'NGN',
    },
    {
      name: 'Superior Room',
      description:
        'An upgraded room with additional space and enhanced amenities, providing a more luxurious experience than the standard room.',
      costAmount: Number(
        faker.finance.amount({
          min: 10000,
          max: 50000,
          symbol: '',
          autoFormat: false,
        }),
      ),
      costCurrency: 'NGN',
    },

    {
      name: 'Deluxe Room',
      description:
        'A premium room offering high-end comfort, superior furnishings, and additional services for a luxurious stay.',
      costAmount: Number(
        faker.finance.amount({
          min: 10000,
          max: 50000,
          symbol: '',
          autoFormat: false,
        }),
      ),
      costCurrency: 'NGN',
    },
  ];
}
