import { RouteHandlerMethod } from "fastify";
import { AppDataSource } from "../db/data-source";
import { Attribute, Category } from "../db/entity/Category";
import categoryService from "../services/category";
import { IsNull } from "typeorm";

const categoryRepo = AppDataSource.getRepository(Category);
const attributeRepo = AppDataSource.getRepository(Attribute);

const addCategory: RouteHandlerMethod = async (request, reply) => {
  const { name, parentId } = request.body as { name: string; parentId: number };
  const parent = parentId ? await categoryService.getCategory(parentId) : null;

  const category = categoryRepo.create({ name, parent });
  await categoryRepo.save(category);

  reply.code(201).send(category);
};

const getCategories: RouteHandlerMethod = async (request, reply) => {
  const categories = await categoryRepo.find({
    where: { parent: IsNull() },
    relations: {
      children: true,
    },
  });
  reply.status(200).send(categories);
};

const getCategory: RouteHandlerMethod = async (request, reply) => {
  const { id } = request.params as { id: string };
  const category = await categoryService.getCategory(Number(id));
  reply.status(200).send(category);
};

const getAttributes: RouteHandlerMethod = async (request, reply) => {
  const attributes = await attributeRepo.find();
  reply.status(200).send(attributes);
};

const addCategoryAttributes: RouteHandlerMethod = async (request, reply) => {
  const body = request.body as { name: string }[];
  const { id } = request.params as { id: string };
  const category = await categoryRepo.findOneBy({
    id: Number(id),
  });

  const attributes = body.map((att) => ({ name: att.name, category }));

  const result = await attributeRepo.insert(attributes);
  reply.status(201).send({ message: "Attributes Created", result });
};

export default {
  addCategory,
  getCategories,
  getAttributes,
  addCategoryAttributes,
  getCategory,
};
