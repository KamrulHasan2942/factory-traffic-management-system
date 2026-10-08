import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Driver } from './driver.entity';

@Injectable()
export class DriversService {
  constructor(
    @InjectRepository(Driver)
    private readonly driverRepository: Repository<Driver>,
  ) {}

  // Create a new driver
  async create(driverData: Partial<Driver>): Promise<Driver> {
    const driver = this.driverRepository.create(driverData);
    return this.driverRepository.save(driver);
  }

  // Get all drivers
  async findAll(): Promise<Driver[]> {
    return this.driverRepository.find();
  }

  // Get one driver by ID
  async findOne(id: number): Promise<Driver> {
    const driver = await this.driverRepository.findOne({
      where: { id },
    });

    if (!driver) {
      throw new NotFoundException(`Driver with ID ${id} not found`);
    }

    return driver;
  }

  // Update a driver
  async update(
    id: number,
    driverData: Partial<Driver>,
  ): Promise<Driver> {
    const driver = await this.findOne(id);

    Object.assign(driver, driverData);

    return this.driverRepository.save(driver);
  }

  // Delete a driver
  async remove(id: number): Promise<{ message: string }> {
    const driver = await this.findOne(id);

    await this.driverRepository.remove(driver);

    return {
      message: `Driver with ID ${id} deleted successfully`,
    };
  }
}