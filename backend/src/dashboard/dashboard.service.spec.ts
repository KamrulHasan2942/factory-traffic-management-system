import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { DashboardService } from './dashboard.service';
import { Traffic } from '../traffic/traffic.entity';
import { Vehicle } from '../vehicles/vehicle.entity';
import { Driver } from '../drivers/driver.entity';
import { Gate } from '../gates/gate.entity';

describe('DashboardService', () => {
  let service: DashboardService;

  const mockTrafficRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    count: jest.fn(),
  };

  const mockVehicleRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    count: jest.fn(),
  };

  const mockDriverRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    count: jest.fn(),
  };

  const mockGateRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    count: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        providers: [
          DashboardService,
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

    service = module.get<DashboardService>(
      DashboardService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});