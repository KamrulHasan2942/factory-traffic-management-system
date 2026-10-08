import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Gate } from './gate.entity';

@Injectable()
export class GatesService {
  constructor(
    @InjectRepository(Gate)
    private readonly gateRepository: Repository<Gate>,
  ) {}

  async create(gateData: Partial<Gate>): Promise<Gate> {
    const gate = this.gateRepository.create(gateData);
    return this.gateRepository.save(gate);
  }

  async findAll(): Promise<Gate[]> {
    return this.gateRepository.find();
  }

  async findOne(id: number): Promise<Gate> {
    const gate = await this.gateRepository.findOne({
      where: { id },
    });

    if (!gate) {
      throw new NotFoundException(`Gate with ID ${id} not found`);
    }

    return gate;
  }

  async update(
    id: number,
    gateData: Partial<Gate>,
  ): Promise<Gate> {
    const gate = await this.findOne(id);
    Object.assign(gate, gateData);
    return this.gateRepository.save(gate);
  }

  async remove(id: number): Promise<{ message: string }> {
    const gate = await this.findOne(id);

    await this.gateRepository.remove(gate);

    return {
      message: `Gate with ID ${id} deleted successfully`,
    };
  }
}