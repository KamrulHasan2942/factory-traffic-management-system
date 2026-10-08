import { Test, TestingModule } from '@nestjs/testing';

import { DriversController } from './drivers.controller';
import { DriversService } from './drivers.service';

describe('DriversController', () => {
  let controller: DriversController;

  const mockDriversService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [DriversController],
        providers: [
          {
            provide: DriversService,
            useValue: mockDriversService,
          },
        ],
      }).compile();

    controller = module.get<DriversController>(
      DriversController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});