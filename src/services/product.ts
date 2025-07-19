import { DeepPartial, FindManyOptions, FindOneOptions } from "typeorm";
import { AppDataSource } from "../db/data-source";
import { Product } from "../db/entity/Product";
import { FastifyError } from "fastify";

const productRepo = AppDataSource.getRepository(Product);

const getProducts = async (options?: FindManyOptions<Product>) => {
  return await productRepo.find({ ...options });
};

const createProduct = async (product: DeepPartial<Product>) => {
  const newProduct = productRepo.create(product);
  return await productRepo.save(newProduct);
};

const getProductById = async (
  id: number,
  options?: FindOneOptions<Product>
) => {
  return productRepo.findOne({
    where: { id },
    relations: ["category"],
    ...options,
  });
};

const deleteProduct = async (id: number) => {
  const user = await productRepo.findOneBy({ id });
  if (user) await productRepo.remove(user);
  else {
    const error = new Error("Product Doesn't exist") as FastifyError;
    error.statusCode = 404;
    throw error;
  }
};

const updateProduct = async () => {};

export default {
  getProducts,
  createProduct,
  getProductById,
  deleteProduct,
  updateProduct,
};
