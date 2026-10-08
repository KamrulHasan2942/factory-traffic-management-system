import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SensorEvent } from './sensor-event.entity';
import { SensorEventService } from './sensor-event.service';
import { SensorEventController } from './sensor-event.controller';

import { JunctionModule } from '../junctions/junction.module';
import { QueueModule } from '../queues/queue.module';
import { TrafficHistoryModule } from '../history/traffic-history.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SensorEvent,
    ]),
    JunctionModule,
    QueueModule,
    TrafficHistoryModule,
  ],
  controllers: [
    SensorEventController,
  ],
  providers: [
    SensorEventService,
  ],
  exports: [
    SensorEventService,
  ],
})
export class SensorEventModule {}