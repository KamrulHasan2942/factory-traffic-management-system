import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { TrafficService } from './traffic.service';
import { Traffic } from './traffic.entity';
import { Vehicle } from '../vehicles/vehicle.entity';
import { Driver } from '../drivers/driver.entity';
import { Gate } from '../gates/gate.entity';

describe('TrafficService', () => {
  let service: TrafficService;

  const mockTrafficRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockVehicleRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
  };

  const mockDriverRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
  };

  const mockGateRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        providers: [
          TrafficService,
          {
            provide: getRepositoryToken(Traffic),
            useValue: mockTrafficRepository,
          },
          {
            provide: getRepositoryToken(Vehicle),
            useValue: mockVehicleRepository,
          },
          {
            provide: getRepositoryToken(Driver),
            useValue: mockDriverRepository,
          },
          {
            provide: getRepositoryToken(Gate),
            useValue: mockGateRepository,
          },
        ],
      }).compile();

    service = module.get<TrafficService>(
      TrafficService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});