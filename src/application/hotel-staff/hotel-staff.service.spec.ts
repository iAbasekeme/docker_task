import { Test, TestingModule } from '@nestjs/testing';
import { HotelStaffService } from './hotel-staff.service';

describe('HotelStaffService', () => {
  let service: HotelStaffService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HotelStaffService],
    }).compile();

    service = module.get<HotelStaffService>(HotelStaffService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
