import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DriversService } from './drivers.service';
import { Driver } from './driver.entity';

describe('DriversService', () => {
  let service: DriversService;

  const mockDriverRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        providers: [
          DriversService,
          {
            provide: getRepositoryToken(Driver),
            useValue: mockDriverRepository,
          },
        ],
      }).compile();

    service = module.get<DriversService>(DriversService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});