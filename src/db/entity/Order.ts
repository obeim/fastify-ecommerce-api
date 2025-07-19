import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Product } from "./Product";
import { User } from "./User";
import { OrderItem } from "./OrderItem";

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantity: number;

  @Column({ type: "float" })
  totalPrice: number;

  @Column()
  status: string;

  @Column()
  deliveryAddress: string;

  @Column()
  deliveryDate: Date;

  @Column()
  paymentMethod: string;

  @Column()
  paymentStatus: string;

  @Column()
  paymentDate: Date;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @CreateDateColumn()
  orderDate: Date;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  orderItems: OrderItem[];
}
