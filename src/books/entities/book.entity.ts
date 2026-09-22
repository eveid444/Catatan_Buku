import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  judul: string;

  @Column()
  penulis: string;

  @Column()
  penerbit: string;

  @Column()
  tahunTerbit: number;

  @Column({ nullable: true, type: 'varchar' })
  deskripsi: string | null; // sekalian benerin temuan #6, bukan nullable implicit any

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}