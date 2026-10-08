import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import {
  Direction,
  VehicleType,
} from '../traffic/domain/traffic.enums';

@Entity('queue_entries')
@Unique(['junctionId', 'vehicleId', 'active'])
export class QueueEntry {
  @PrimaryGeneratedColumn()
  id: number;

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
    type: 'int',
  })
  priority: number;

  @Column({
    type: 'datetime',
  })
  arrivedAt: Date;

  @Column({
    type: 'boolean',
    default: true,
  })
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;
}