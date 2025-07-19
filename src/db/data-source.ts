import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import config from "../config/config";
import { Product } from "./entity/Product";
import { Order } from "./entity/Order";
import { ProductView } from "./entity/ProductView";
import { Attribute, Category, ProductAttributeValue } from "./entity/Category";
import { Cart } from "./entity/Cart";
import { CartItem } from "./entity/CartItem";
import { OrderItem } from "./entity/OrderItem";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: config.db.host,
  port: parseInt(config.db.port || "5432"),
  username: config.db.user,
  password: config.db.password,
  database: config.db.name,
  synchronize: true,
  logging: false,
  entities: [
    User,
    Product,
    Order,
    ProductView,
    Category,
    Attribute,
    ProductAttributeValue,
    Cart,
    CartItem,
    OrderItem,
  ],
  migrations: [
    config.env === "production"
      ? "dist/db/migration/*{.ts,.js}"
      : "src/db/migration/**/*.ts",
  ],
});
