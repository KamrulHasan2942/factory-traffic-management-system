import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Vehicle } from '../vehicles/vehicle.entity';
import { Driver } from '../drivers/driver.entity';
import { Gate } from '../gates/gate.entity';

@Entity('traffic')
export class Traffic {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Vehicle)
  @JoinColumn({ name: 'vehicleId' })
  vehicle: Vehicle;

  @Column()
  vehicleId: number;

  @ManyToOne(() => Driver)
  @JoinColumn({ name: 'driverId' })
  driver: Driver;

  @Column()
  driverId: number;

  @ManyToOne(() => Gate)
  @JoinColumn({ name: 'gateId' })
  gate: Gate;

  @Column()
  gateId: number;

  @Column({ type: 'datetime' })
  entryTime: Date;

  @Column({ type: 'datetime', nullable: true })
  exitTime: Date;

  @Column({ length: 20, default: 'INSIDE' })
  status: string;
}