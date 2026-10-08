import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Junction } from './junction.entity';
import { JunctionService } from './junction.service';
import { JunctionController } from './junction.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Junction]),
  ],

  controllers: [
    JunctionController,
  ],

  providers: [
    JunctionService,
  ],

  exports: [
    JunctionService,
    TypeOrmModule,
  ],
})
export class JunctionModule {}