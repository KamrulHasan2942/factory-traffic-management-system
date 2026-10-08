import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TrafficHistory } from './traffic-history.entity';
import { TrafficHistoryService } from './traffic-history.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TrafficHistory]),
  ],
  providers: [TrafficHistoryService],
  exports: [TrafficHistoryService],
})
export class TrafficHistoryModule {}