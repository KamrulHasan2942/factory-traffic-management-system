import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('gates')
export class Gate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, unique: true })
  name: string;

  @Column({ length: 100, nullable: true })
  location: string;

  @Column({ default: true })
  isActive: boolean;
}