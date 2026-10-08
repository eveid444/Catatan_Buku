import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  judul: string;

  @Column()
  penulis: string;

  @Column({ type: 'varchar', nullable: true })
  penerbit: string | null;

  @Column({ type: 'int', nullable: true })
  tahunTerbit: number | null;

  @Column({ type: 'varchar', nullable: true })
  deskripsi: string | null;

  @Column({ type: 'text', array: true, default: () => "'{}'" })
  tags: string[];

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}