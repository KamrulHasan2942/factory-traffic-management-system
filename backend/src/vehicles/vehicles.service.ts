import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from './vehicle.entity';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
  ) {}

  // Create a new vehicle
  async create(vehicleData: Partial<Vehicle>): Promise<Vehicle> {
    const vehicle = this.vehicleRepository.create(vehicleData);
    return this.vehicleRepository.save(vehicle);
  }

  // Get all vehicles
  async findAll(): Promise<Vehicle[]> {
    return this.vehicleRepository.find();
  }

  // Get one vehicle by ID
  async findOne(id: number): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findOne({
      where: { id },
    });

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }

    return vehicle;
  }

  // Update a vehicle
  async update(
    id: number,
    vehicleData: Partial<Vehicle>,
  ): Promise<Vehicle> {
    const vehicle = await this.findOne(id);

    Object.assign(vehicle, vehicleData);

    return this.vehicleRepository.save(vehicle);
  }

  // Delete a vehicle
  async remove(id: number): Promise<{ message: string }> {
    const vehicle = await this.findOne(id);

    await this.vehicleRepository.remove(vehicle);

    return {
      message: `Vehicle with ID ${id} deleted successfully`,
    };
  }
}