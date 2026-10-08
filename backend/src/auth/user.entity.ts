import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  name!: string;

  @Column({ length: 150, unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ length: 20, default: 'USER' })
  role!: string;

  @Column({ default: true })
  isActive!: boolean;
}