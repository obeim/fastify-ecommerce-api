import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  Unique,
  OneToMany,
  ManyToMany,
  OneToOne,
} from "typeorm";
import bcrypt from "bcrypt";
import { Product } from "./Product";
import { Order } from "./Order";
import { ProductView } from "./ProductView";
import { Cart } from "./Cart";

export enum UserRoles {
  USER = "user",
  ADMIN = "admin",
  SELLER = "seller",
}

@Entity()
@Unique(["email", "username"])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ select: false })
  password: string;

  @Column()
  email: string;

  @Column()
  username: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  age: number;

  @Column({
    type: "enum",
    enum: UserRoles,
    default: UserRoles.USER,
  })
  role: string;

  @ManyToMany(() => Product, (product) => product.sellers)
  products: Product[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => ProductView, (productView) => productView.user)
  productViews: ProductView[];

  @OneToOne(() => Cart, (cart) => cart.user)
  cart: Cart;

  @Column({ nullable: true, select: false })
  refreshToken: string;

  @BeforeInsert()
  async hashPassword() {
    const hashedPassword = await bcrypt.hash(this.password!, 10);
    this.password = hashedPassword;
  }
}
