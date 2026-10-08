import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { VehiclesModule } from './vehicles/vehicles.module';
import { DriversModule } from './drivers/drivers.module';
import { TrafficModule } from './traffic/traffic.module';
import { GatesModule } from './gates/gates.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AuthModule } from './auth/auth.module';
import { JunctionModule } from './junctions/junction.module';
import { SensorEventModule } from './sensor-events/sensor-event.module';
import { QueueModule } from './queues/queue.module';
import { TrafficHistoryModule } from './history/traffic-history.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
    }),

    VehiclesModule,
    DriversModule,
    TrafficModule,
    GatesModule,
    DashboardModule,
    AuthModule,

    JunctionModule,
    SensorEventModule,
    QueueModule,
    TrafficHistoryModule,
  ],
})
export class AppModule {}