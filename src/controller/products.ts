import { DeepPartial, Not } from "typeorm";
import { RouteHandlerMethod } from "fastify";
import productsService from "../services/product";
import { Product } from "../db/entity/Product";
import usersService from "../services/user";
import { paginate } from "../services/utils";
import { AppDataSource } from "../db/data-source";
import productViewService from "../services/productView";
import { ProductAttributeValue } from "../db/entity/Category";

const productsRepo = AppDataSource.getRepository(Product);
const productAttributeValueRepo = AppDataSource.getRepository(
  ProductAttributeValue
);

const getProducts: RouteHandlerMethod = async (request, reply) => {
  const { page = 1, offset = 10 } = request.query as {
    page?: number;
    offset?: number;
  };

  const result = await paginate(productsRepo, {
    page: page,
    limit: offset,
    relations: ["sellers", "category", "views"],
  });
  return reply.status(200).send(result);
};

const addProduct: RouteHandlerMethod = async (request, reply) => {
  const body = request.body as DeepPartial<Product>;
  const user = await usersService.getUserById(request.user.id.toString());

  const product = await productsService.createProduct({
    ...body,
    sellers: [user],
  });

  const values = (body.attributes as { value: string; id: number }[])?.map(
    (attr) => ({
      product,
      attribute: { id: attr.id },
      value: attr.value,
    })
  );

  if (values) await productAttributeValueRepo.save(values);

  reply.status(201).send(product);
};

const deleteProduct: RouteHandlerMethod = async (request, reply) => {
  const { id } = request.params as { id: string };

  await productsService.deleteProduct(Number(id));
  reply.status(201).send({ message: "Product Deleted Successfully" });
};

const getProductById: RouteHandlerMethod = async (request, reply) => {
  const { id: productId } = request.params as { id: string };
  const user = request.user;

  const product = await productsService.getProductById(parseInt(productId));
  const suggestions = await productsService.getProducts({
    where: {
      id: Not(parseInt(productId)),
      category: product.category,
    },
    take: 10,
  });

  if (!product) {
    return reply.code(404).send({ message: "Product not found" });
  }

  if (user) {
    const recentView = await productViewService.getRecentView(
      user.id,
      parseInt(productId)
    );

    if (!recentView) {
      await productViewService.createProductView({
        user: user,
        product: product,
      });
    }
  }

  reply.status(200).send({ product, suggestions });
};

export default {
  getProducts,
  addProduct,
  deleteProduct,
  getProductById,
};
