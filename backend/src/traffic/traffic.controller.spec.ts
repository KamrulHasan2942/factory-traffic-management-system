import { Test, TestingModule } from '@nestjs/testing';

import { TrafficController } from './traffic.controller';
import { TrafficService } from './traffic.service';

describe('TrafficController', () => {
  let controller: TrafficController;

  const mockTrafficService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [TrafficController],
        providers: [
          {
            provide: TrafficService,
            useValue: mockTrafficService,
          },
        ],
      }).compile();

    controller = module.get<TrafficController>(
      TrafficController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});