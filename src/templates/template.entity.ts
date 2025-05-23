// src/templates/template.entity.ts
import { Category } from 'src/categories/category.entity';
import { User } from 'src/user/user.entity';
import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn
} from 'typeorm';

@Entity('templates')
export class Template {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ unique: true })
  slug: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'varchar', length: 255, nullable: true})
  thumbnail_url: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true})
  preview_url: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true})
  download_path: string | null;

  @Column({ type: 'enum', enum: ['draft', 'published'], default: 'draft' })
  status: 'draft' | 'published';

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, user => user.id)
  user: User;

  @ManyToOne(() => Category, (category) => category.templates, { eager: true })
  category: Category;

  @Column()
  categoryId: string;
}
