import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20, unique: true })
  vehicleNumber: string;

  @Column({ length: 50 })
  vehicleType: string;

  @Column({ length: 100 })
  driverName: string;

  @Column({ length: 20 })
  driverPhone: string;

  @Column({ default: true })
  isActive: boolean;
}