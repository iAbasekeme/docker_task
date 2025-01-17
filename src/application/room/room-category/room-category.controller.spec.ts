import { Test, TestingModule } from '@nestjs/testing';
import { RoomCategoryController } from './room-category.controller';
import { RoomCategoryService } from './room-category.service';

describe('RoomCategoryController', () => {
  let controller: RoomCategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomCategoryController],
      providers: [RoomCategoryService],
    }).compile();

    controller = module.get<RoomCategoryController>(RoomCategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
