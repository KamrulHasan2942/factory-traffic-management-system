import { Test, TestingModule } from '@nestjs/testing';

import { GatesController } from './gates.controller';
import { GatesService } from './gates.service';

describe('GatesController', () => {
  let controller: GatesController;

  const mockGatesService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [GatesController],
        providers: [
          {
            provide: GatesService,
            useValue: mockGatesService,
          },
        ],
      }).compile();

    controller = module.get<GatesController>(
      GatesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});