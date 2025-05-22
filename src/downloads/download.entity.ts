// src/downloads/download.entity.ts
import {
    Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn
} from 'typeorm';
import { Template } from '../templates/template.entity';
import { User } from 'src/user/user.entity';

@Entity('downloads')
export class Download {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User)
    user: User;

    @ManyToOne(() => Template)
    template: Template;

    @Column()
    download_url: string;

    @Column({ default: 1 })
    max_attempts: number;

    @Column({ default: 0 })
    attempts: number;

    @Column()
    expires_at: Date;

    @CreateDateColumn()
    created_at: Date;
}
