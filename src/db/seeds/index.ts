import "reflect-metadata";
import { AppDataSource } from "../data-source";
import { Attribute, Category, ProductAttributeValue } from "../entity/Category";
import { Product } from "../entity/Product";
import { User, UserRoles } from "../entity/User";
import { Order } from "../entity/Order";
import { OrderItem } from "../entity/OrderItem";

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log("✅ Database connection initialized");

    console.log("🧨 Dropping and synchronizing database...");
    await AppDataSource.dropDatabase();
    await AppDataSource.synchronize();

    // ===== Users =====
    const admin = AppDataSource.manager.create(User, {
      email: "admin@example.com",
      username: "admin",
      password: "admin123",
      firstName: "Admin",
      lastName: "User",
      age: 30,
      role: UserRoles.ADMIN,
    });

    const seller = AppDataSource.manager.create(User, {
      email: "seller@example.com",
      username: "seller",
      password: "seller123",
      firstName: "John",
      lastName: "Doe",
      age: 28,
      role: UserRoles.SELLER,
    });

    const buyer = AppDataSource.manager.create(User, {
      email: "user@example.com",
      username: "user",
      password: "user123",
      firstName: "Jane",
      lastName: "Smith",
      age: 25,
      role: UserRoles.USER,
    });

    await AppDataSource.manager.save([admin, seller, buyer]);

    // ===== Categories =====
    const electronics = AppDataSource.manager.create(Category, {
      name: "Electronics",
    });

    const cloth = AppDataSource.manager.create(Category, {
      name: "Cloths",
    });
    await AppDataSource.manager.save([electronics, cloth]);

    const laptops = AppDataSource.manager.create(Category, {
      name: "Laptops",
      parent: electronics,
    });
    const smartphones = AppDataSource.manager.create(Category, {
      name: "Smartphones",
      parent: electronics,
    });
    await AppDataSource.manager.save([laptops, smartphones]);

    // ===== Attributes & Values =====
    const ramAttr = AppDataSource.manager.create(Attribute, {
      name: "RAM",
      category: laptops,
    });
    const storageAttr = AppDataSource.manager.create(Attribute, {
      name: "Storage",
      category: laptops,
    });
    await AppDataSource.manager.save([ramAttr, storageAttr]);

    const ram8 = AppDataSource.manager.create(ProductAttributeValue, {
      value: "8GB",
      attribute: ramAttr,
    });
    const ram16 = AppDataSource.manager.create(ProductAttributeValue, {
      value: "16GB",
      attribute: ramAttr,
    });
    const ssd256 = AppDataSource.manager.create(ProductAttributeValue, {
      value: "256GB SSD",
      attribute: storageAttr,
    });
    const ssd512 = AppDataSource.manager.create(ProductAttributeValue, {
      value: "512GB SSD",
      attribute: storageAttr,
    });
    await AppDataSource.manager.save([ram8, ram16, ssd256, ssd512]);

    // ===== Products =====
    const laptop = AppDataSource.manager.create(Product, {
      name: "MacBook Air M2",
      description: "Apple M2 chip, 8GB RAM, 256GB SSD.",
      price: 1099.99,
      quantity: 50,
      category: laptops,
      sellers: [seller],
      images: [
        "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/macbook-air-m2",
      ],
      attributeValues: [ram8, ssd256],
    });

    const tshirt = AppDataSource.manager.create(Product, {
      name: "Men’s Cotton T-Shirt",
      price: 12.99,
      description: "Soft and breathable cotton t-shirt",
      images: [
        "https://m.media-amazon.com/images/I/71-7e4R3U5L._AC_UL1500_.jpg",
        "https://m.media-amazon.com/images/I/61DUW2U5cIL._AC_UL1500_.jpg",
      ],
      quantity: 80,
      category: cloth,
      sellers: [seller],
    });

    await AppDataSource.manager.save([laptop, tshirt]);

    // ===== Orders & OrderItems =====
    const orderItem1 = AppDataSource.manager.create(OrderItem, {
      product: laptop,
      quantity: 2,
      price: laptop.price,
    });

    const orderItem2 = AppDataSource.manager.create(OrderItem, {
      product: tshirt,
      quantity: 3,
      price: tshirt.price,
    });

    await AppDataSource.manager.save([orderItem1, orderItem2]);

    const totalQuantity = orderItem1.quantity + orderItem2.quantity;
    const totalPrice =
      orderItem1.quantity * Number(orderItem1.price) +
      orderItem2.quantity * Number(orderItem2.price);

    const order = AppDataSource.manager.create(Order, {
      user: buyer,
      quantity: totalQuantity,
      totalPrice: totalPrice,
      status: "PAID",
      deliveryAddress: "123 Main St, Cairo, Egypt",
      deliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      paymentMethod: "Credit Card",
      paymentStatus: "PAID",
      paymentDate: new Date(),
      orderItems: [orderItem1, orderItem2],
    });

    await AppDataSource.manager.save(order);

    console.log("✅ Seeding completed successfully");
  } catch (err) {
    console.error("❌ Error while seeding:", err);
  } finally {
    await AppDataSource.destroy();
    console.log("🔌 Connection closed");
  }
}

seed();
