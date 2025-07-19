import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
  JoinTable,
  ManyToOne,
} from "typeorm";
import { User } from "./User";
import { Order } from "./Order";
import { ProductView } from "./ProductView";
import { Category, ProductAttributeValue } from "./Category";
import { OrderItem } from "./OrderItem";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: false })
  price: number;

  @Column()
  description: string;

  @Column("simple-array")
  images: string[];

  @Column()
  quantity: number;

  @JoinTable()
  @ManyToMany(() => User, (user) => user.products)
  sellers: User[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[];

  @OneToMany(() => ProductView, (productView) => productView.product)
  views: ProductView[];

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

  @OneToMany(() => ProductAttributeValue, (val) => val.product)
  attributes: ProductAttributeValue[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
