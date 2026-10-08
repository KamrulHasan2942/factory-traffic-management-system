import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Traffic } from './traffic.entity';
import { Vehicle } from '../vehicles/vehicle.entity';
import { Driver } from '../drivers/driver.entity';
import { Gate } from '../gates/gate.entity';

@Injectable()
export class TrafficService {
  constructor(
    @InjectRepository(Traffic)
    private readonly trafficRepository: Repository<Traffic>,

    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,

    @InjectRepository(Driver)
    private readonly driverRepository: Repository<Driver>,

    @InjectRepository(Gate)
    private readonly gateRepository: Repository<Gate>,
  ) {}

  async create(trafficData: Partial<Traffic>): Promise<Traffic> {
    const traffic = this.trafficRepository.create(trafficData);

    return this.trafficRepository.save(traffic);
  }

  async findAll(): Promise<Traffic[]> {
    return this.trafficRepository.find({
      relations: {
        vehicle: true,
        driver: true,
        gate: true,
      },
    });
  }

  async findOne(id: number): Promise<Traffic> {
    const traffic = await this.trafficRepository.findOne({
      where: { id },
      relations: {
        vehicle: true,
        driver: true,
        gate: true,
      },
    });

    if (!traffic) {
      throw new NotFoundException(
        `Traffic record with ID ${id} not found`,
      );
    }

    return traffic;
  }

  async update(
    id: number,
    trafficData: Partial<Traffic>,
  ): Promise<Traffic> {
    const traffic = await this.findOne(id);

    Object.assign(traffic, trafficData);

    return this.trafficRepository.save(traffic);
  }

  async remove(id: number): Promise<{ message: string }> {
    const traffic = await this.findOne(id);

    await this.trafficRepository.remove(traffic);

    return {
      message: `Traffic record with ID ${id} deleted successfully`,
    };
  }

  // Vehicle Entry
  async vehicleEntry(
    vehicleId: number,
    driverId: number,
    gateId: number,
  ): Promise<Traffic> {

    // 1. Check vehicle
    const vehicle = await this.vehicleRepository.findOne({
      where: { id: vehicleId },
    });

    if (!vehicle) {
      throw new NotFoundException(
        `Vehicle with ID ${vehicleId} not found`,
      );
    }

    // 2. Check vehicle active status
    if (!vehicle.isActive) {
      throw new BadRequestException(
        `Vehicle with ID ${vehicleId} is inactive`,
      );
    }

    // 3. Check driver
    const driver = await this.driverRepository.findOne({
      where: { id: driverId },
    });

    if (!driver) {
      throw new NotFoundException(
        `Driver with ID ${driverId} not found`,
      );
    }

    // 4. Check driver active status
    if (!driver.isActive) {
      throw new BadRequestException(
        `Driver with ID ${driverId} is inactive`,
      );
    }

    // 5. Check gate
    const gate = await this.gateRepository.findOne({
      where: { id: gateId },
    });

    if (!gate) {
      throw new NotFoundException(
        `Gate with ID ${gateId} not found`,
      );
    }

    // 6. Check gate active status
    if (!gate.isActive) {
      throw new BadRequestException(
        `Gate with ID ${gateId} is inactive`,
      );
    }

    // 7. Check duplicate entry
    const existingInside = await this.trafficRepository.findOne({
      where: {
        vehicleId,
        status: 'INSIDE',
      },
    });

    if (existingInside) {
      throw new BadRequestException(
        `Vehicle with ID ${vehicleId} is already inside the factory`,
      );
    }

    // 8. Create entry
    const traffic = this.trafficRepository.create({
      vehicleId,
      driverId,
      gateId,
      entryTime: new Date(),
      status: 'INSIDE',
    });

    return this.trafficRepository.save(traffic);
  }

  // Vehicle Exit
  async vehicleExit(id: number): Promise<Traffic> {
    const traffic = await this.findOne(id);

    if (traffic.status === 'EXITED') {
      throw new BadRequestException(
        `Traffic record with ID ${id} has already exited`,
      );
    }

    traffic.exitTime = new Date();
    traffic.status = 'EXITED';

    return this.trafficRepository.save(traffic);
  }
}