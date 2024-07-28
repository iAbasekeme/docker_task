import { Test, TestingModule } from '@nestjs/testing';
import { BankDetailService } from './bank-detail.service';

describe('BankDetailService', () => {
  let service: BankDetailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BankDetailService],
    }).compile();

    service = module.get<BankDetailService>(BankDetailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
