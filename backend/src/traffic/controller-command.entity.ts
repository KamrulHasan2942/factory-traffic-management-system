import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';

import {
  Phase,
  SignalState,
} from './domain/traffic.enums';

export enum ControllerCommandStatus {
  PENDING = 'PENDING',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  TIMEOUT = 'TIMEOUT',
  FAILED = 'FAILED',
}

@Entity('controller_commands')
@Unique(['commandId'])
export class ControllerCommand {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 100,
  })
  commandId: string;

  @Column({
    type: 'varchar',
    length: 20,
  })
  junctionId: string;

  @Column({
    type: 'enum',
    enum: Phase,
  })
  desiredPhase: Phase;

  @Column({
    type: 'enum',
    enum: SignalState,
  })
  desiredState: SignalState;

  @Column({
    type: 'enum',
    enum: ControllerCommandStatus,
    default: ControllerCommandStatus.PENDING,
  })
  status: ControllerCommandStatus;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  failureReason: string | null;

  @Column({
    type: 'datetime',
    nullable: true,
  })
  acknowledgedAt: Date | null;

  @Column({
    type: 'datetime',
    nullable: true,
  })
  timeoutAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}