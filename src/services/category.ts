import { FastifyError } from "fastify";
import { AppDataSource } from "../db/data-source";
import { Attribute, Category } from "../db/entity/Category";
import { FindOneOptions } from "typeorm";

const categoryRepo = AppDataSource.getRepository(Category);

const getCategory = async (id: number, options?: FindOneOptions<Category>) => {
  const category = await categoryRepo.findOne({
    where: { id: Number(id) },
    relations: {
      children: true,
    },
    ...options,
  });
  if (!category) {
    const error = new Error("Category not found") as FastifyError;
    error.statusCode = 404;
    throw error;
  }
  return category;
};

export default { getCategory };
