import { DeepPartial, Equal, FindOneOptions, In, MoreThan } from "typeorm";
import { AppDataSource } from "../db/data-source";
import { ProductView } from "../db/entity/ProductView";
import { FastifyError } from "fastify";

const productViewRepo = AppDataSource.getRepository(ProductView);

const createProductView = async (productView: DeepPartial<ProductView>) => {
  return productViewRepo.create(productView);
};

const getRecentView = async (
  userId: Number,
  productId: number,
  options?: FindOneOptions<ProductView>
) => {
  const productView = await productViewRepo.findOne({
    where: {
      user: Equal(userId),
      product: Equal(productId),
      viewedAt: MoreThan(new Date(Date.now() - 1000 * 60 * 30)),
    },
    ...options,
  });
  if (!productView) {
    const error = new Error("Product View Not Found") as FastifyError;
    error.statusCode = 404;
    throw error;
  }
  return productView;
};

export default { createProductView, getRecentView };
