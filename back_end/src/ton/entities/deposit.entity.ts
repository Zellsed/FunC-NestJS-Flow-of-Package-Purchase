import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class DepositEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  address: string;

  @Column()
  publicKey: string;

  @Column()
  amount: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  update_at: Date;
}
