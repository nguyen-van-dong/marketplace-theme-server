import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: ['user', 'admin'], default: 'user' })
  role: 'user' | 'admin';

  @Column({ default: false })
  is_verified: boolean;

  @Column({ nullable: true, type: 'varchar', length: 255 })
  email_verification_token: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  reset_password_token: string | null;

  @Column({ type: 'datetime', nullable: true })
  reset_password_expires: Date | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
