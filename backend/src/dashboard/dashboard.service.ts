import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Traffic } from '../traffic/traffic.entity';
import { Vehicle } from '../vehicles/vehicle.entity';
import { Driver } from '../drivers/driver.entity';
import { Gate } from '../gates/gate.entity';

@Injectable()
export class DashboardService {
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

  async getStatistics() {
    // Total vehicles
    const totalVehicles = await this.vehicleRepository.count();

    // Total drivers
    const totalDrivers = await this.driverRepository.count();

    // Active gates
    const activeGates = await this.gateRepository.count({
      where: {
        isActive: true,
      },
    });

    // Unique vehicles currently inside
    const vehiclesInsideResult = await this.trafficRepository
      .createQueryBuilder('traffic')
      .select('COUNT(DISTINCT traffic.vehicleId)', 'count')
      .where('traffic.status = :status', {
        status: 'INSIDE',
      })
      .getRawOne();

    const vehiclesInside = Number(vehiclesInsideResult.count);

    // Total entries today
    const totalEntriesToday = await this.trafficRepository
      .createQueryBuilder('traffic')
      .where('DATE(traffic.entryTime) = CURDATE()')
      .getCount();

    // Total exits today
    const totalExitsToday = await this.trafficRepository
      .createQueryBuilder('traffic')
      .where('DATE(traffic.exitTime) = CURDATE()')
      .andWhere('traffic.status = :status', {
        status: 'EXITED',
      })
      .getCount();

    return {
      totalVehicles,
      totalDrivers,
      activeGates,
      vehiclesInside,
      totalEntriesToday,
      totalExitsToday,
    };
  }
}