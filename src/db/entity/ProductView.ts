import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";
import { Product } from "./Product";

@Entity()
export class ProductView {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.productViews)
  user: User;

  @ManyToOne(() => Product, (product) => product.views)
  product: Product;

  @CreateDateColumn()
  viewedAt: Date;
}
