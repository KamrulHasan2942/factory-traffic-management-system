import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GatesController } from './gates.controller';
import { GatesService } from './gates.service';
import { Gate } from './gate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Gate])],
  controllers: [GatesController],
  providers: [GatesService],
})
export class GatesModule {}