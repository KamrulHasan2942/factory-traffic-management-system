import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TrafficHistory } from './traffic-history.entity';

@Injectable()
export class TrafficHistoryService {
  constructor(
    @InjectRepository(TrafficHistory)
    private readonly trafficHistoryRepository: Repository<TrafficHistory>,
  ) {}

  async create(data: Partial<TrafficHistory>): Promise<TrafficHistory> {
    const history = this.trafficHistoryRepository.create(data);

    return await this.trafficHistoryRepository.save(history);
  }

  async findAll(): Promise<TrafficHistory[]> {
    return await this.trafficHistoryRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: number): Promise<TrafficHistory | null> {
    return await this.trafficHistoryRepository.findOne({
      where: { id },
    });
  }
}