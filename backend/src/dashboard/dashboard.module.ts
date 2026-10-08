import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

import { Traffic } from '../traffic/traffic.entity';
import { Vehicle } from '../vehicles/vehicle.entity';
import { Driver } from '../drivers/driver.entity';
import { Gate } from '../gates/gate.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Traffic,
      Vehicle,
      Driver,
      Gate,
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}