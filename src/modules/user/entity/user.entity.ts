import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  userId: string;

  @Column({ default: '' })
  username: string;

  @Column({ default: '1', select: false })
  password: string;

  @Column({ default: 'public/avatar/customer.png' })
  avatar: string;

  @Column({ default: 'customer' })
  role: string;

  @Column({ default: 'on' })
  status: string;

  @Column({ default: false })
  isOnline: boolean;

  @Column({type: 'double',default: new Date().valueOf()})
  createTime: number;
}
