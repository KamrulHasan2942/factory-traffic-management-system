import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

import {
  Phase,
  SignalState,
  TrafficMode,
} from '../traffic/domain/traffic.enums';

@Entity('junctions')
export class Junction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  junctionId: string;

  @Column({ default: 'Factory Junction' })
  name: string;

  @Column({
    type: 'enum',
    enum: TrafficMode,
    default: TrafficMode.AUTOMATIC,
  })
  mode: TrafficMode;

  // Actual phase confirmed by the physical controller.
  @Column({
    type: 'enum',
    enum: Phase,
    default: Phase.NORTH_SOUTH,
  })
  currentPhase: Phase;

  // Phase requested by the traffic-control system.
  @Column({
    type: 'enum',
    enum: Phase,
    default: Phase.NORTH_SOUTH,
  })
  desiredPhase: Phase;

  // Signal state requested by the traffic-control system.
  @Column({
    type: 'enum',
    enum: SignalState,
    default: SignalState.RED,
  })
  desiredSignalState: SignalState;

  @Column({
    type: 'enum',
    enum: SignalState,
    default: SignalState.RED,
  })
  northSignal: SignalState;

  @Column({
    type: 'enum',
    enum: SignalState,
    default: SignalState.RED,
  })
  southSignal: SignalState;

  @Column({
    type: 'enum',
    enum: SignalState,
    default: SignalState.RED,
  })
  eastSignal: SignalState;

  @Column({
    type: 'enum',
    enum: SignalState,
    default: SignalState.RED,
  })
  westSignal: SignalState;

  @Column({ default: true })
  isActive: boolean;

  @Column({
    type: 'varchar',
    length: 30,
    default: 'UNKNOWN',
  })
  controllerStatus: string;

  @Column({
    type: 'varchar',
    length: 30,
    default: 'UNKNOWN',
  })
  sensorStatus: string;

  // Last actual state confirmed/reported by the physical controller.
  @Column({
    type: 'varchar',
    length: 30,
    default: 'UNKNOWN',
  })
  actualControllerState: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  emergencyDirection: string | null;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  emergencyVehicleId: string | null;
}