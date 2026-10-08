import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TrafficControllerService } from './traffic-controller.service';
import { TrafficControllerController } from './traffic-controller.controller';

import { Junction } from '../junctions/junction.entity';
import { QueueModule } from '../queues/queue.module';

import { ControllerCommand } from './controller-command.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Junction,
      ControllerCommand,
    ]),
    QueueModule,
  ],

  controllers: [
    TrafficControllerController,
  ],

  providers: [
    TrafficControllerService,
  ],

  exports: [
    TrafficControllerService,
  ],
})
export class TrafficModule {}