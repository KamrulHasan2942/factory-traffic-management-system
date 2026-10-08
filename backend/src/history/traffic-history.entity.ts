import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('traffic_history')
export class TrafficHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  junctionId: string;

  @Column()
  sensorId: string;

  @Column({ nullable: true })
  vehicleId: string;

  @Column()
  eventType: string;

  @Column({ nullable: true })
  previousStatus: string;

  @Column({ nullable: true })
  newStatus: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  direction: string;

  @CreateDateColumn()
  createdAt: Date;
}