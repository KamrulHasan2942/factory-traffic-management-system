import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { GatesService } from './gates.service';
import { Gate } from './gate.entity';

describe('GatesService', () => {
  let service: GatesService;

  const mockGateRepository = {
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
          GatesService,
          {
            provide: getRepositoryToken(Gate),
            useValue: mockGateRepository,
          },
        ],
      }).compile();

    service = module.get<GatesService>(GatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});