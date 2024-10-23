import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class BuyPackageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  address: string;

  @Column()
  publicKey: string;

  @Column()
  id_Package: number;

  @Column()
  name: string;

  @Column()
  price: string;

  @Column()
  description: string;

  @Column()
  duration: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  update_at: Date;
}
