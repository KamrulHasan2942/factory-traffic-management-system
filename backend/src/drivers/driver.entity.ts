import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('drivers')
export class Driver {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 20, unique: true })
  phone: string;

  @Column({ length: 50, unique: true })
  licenseNumber: string;

  @Column({ default: true })
  isActive: boolean;
}