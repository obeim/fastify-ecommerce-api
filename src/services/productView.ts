import { DeepPartial, Equal, FindOneOptions, In, MoreThan } from "typeorm";
import { AppDataSource } from "../db/data-source";
import { ProductView } from "../db/entity/ProductView";

const productViewRepo = AppDataSource.getRepository(ProductView);

const createProductView = async (productView: DeepPartial<ProductView>) => {
  return productViewRepo.create(productView);
};

const getRecentView = async (
  userId: Number,
  productId: number,
  options?: FindOneOptions<ProductView>
) => {
  return productViewRepo.findOne({
    where: {
      user: Equal(userId),
      product: Equal(productId),
      viewedAt: MoreThan(new Date(Date.now() - 1000 * 60 * 30)),
    },
    ...options,
  });
};

export default { createProductView, getRecentView };
