import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import {
  Direction,
  SensorEventType,
  VehicleType,
} from '../traffic/domain/traffic.enums';

@Entity('sensor_events')
@Unique(['eventId'])
export class SensorEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 100,
  })
  eventId: string;

  @Column({
    type: 'varchar',
    length: 20,
  })
  junctionId: string;

  @Column({
    type: 'enum',
    enum: Direction,
  })
  direction: Direction;

  @Column({
    type: 'enum',
    enum: SensorEventType,
  })
  eventType: SensorEventType;

  @Column({
    type: 'varchar',
    length: 100,
  })
  vehicleId: string;

  @Column({
    type: 'enum',
    enum: VehicleType,
  })
  vehicleType: VehicleType;

  @Column({
    type: 'bigint',
  })
  sequenceNo: number;

  @Column({
    type: 'datetime',
  })
  eventTimestamp: Date;

  @CreateDateColumn()
  receivedAt: Date;

  @Column({
    type: 'boolean',
    default: true,
  })
  processed: boolean;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  rejectionReason: string | null;
}