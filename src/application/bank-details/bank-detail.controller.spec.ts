import { Test, TestingModule } from '@nestjs/testing';
import { BankDetailController } from './bank-detail.controller';


describe('WalletController', () => {
  let controller: BankDetailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BankDetailController],
    }).compile();

    controller = module.get<BankDetailController>(BankDetailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
