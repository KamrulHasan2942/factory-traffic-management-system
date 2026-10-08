import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Junction } from './junction.entity';

@Injectable()
export class JunctionService {
  constructor(
    @InjectRepository(Junction)
    private readonly junctionRepository: Repository<Junction>,
  ) {}

  async create(data: Partial<Junction>) {
    const junction = this.junctionRepository.create({
      ...data,
    });

    return this.junctionRepository.save(junction);
  }

  async findAll() {
    return this.junctionRepository.find({
      order: {
        id: 'ASC',
      },
    });
  }

  async findOne(junctionId: string) {
    const junction = await this.junctionRepository.findOne({
      where: {
        junctionId,
      },
    });

    if (!junction) {
      throw new NotFoundException(
        `Junction ${junctionId} not found`,
      );
    }

    return junction;
  }
}