import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { VehiclesService } from './vehicles.service';
import { Vehicle } from './vehicle.entity';

describe('VehiclesService', () => {
  let service: VehiclesService;

  const mockVehicleRepository = {
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
          VehiclesService,
          {
            provide: getRepositoryToken(Vehicle),
            useValue: mockVehicleRepository,
          },
        ],
      }).compile();

    service = module.get<VehiclesService>(
      VehiclesService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});