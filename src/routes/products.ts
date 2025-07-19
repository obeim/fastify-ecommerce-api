import { FastifyPluginCallback } from "fastify";
import productsController from "../controller/products";
import { UserRoles } from "../db/entity/User";

const productsRoutes: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.get(
    "/",
    { preHandler: [fastify.authenticate] },
    productsController.getProducts
  );

  fastify.post(
    "/",
    {
      preHandler: [
        fastify.authenticate,
        fastify.authorize([UserRoles.SELLER, UserRoles.ADMIN]),
      ],
    },
    productsController.addProduct
  );

  fastify.delete(
    "/:id",
    {
      preHandler: [
        fastify.authenticate,
        fastify.authorize([UserRoles.SELLER, UserRoles.ADMIN]),
      ],
    },
    productsController.deleteProduct
  );

  fastify.get(
    "/categories",
    { preHandler: [fastify.authenticate] },
    productsController.getCategories
  );

  fastify.post(
    "/categories",
    {
      preHandler: [fastify.authenticate, fastify.authorize([UserRoles.ADMIN])],
    },
    productsController.addCategory
  );

  fastify.get(
    "/categories/:id",
    {
      preHandler: [fastify.authenticate],
    },
    productsController.getCategory
  );

  fastify.post(
    "/categories/:id/attributes",
    {
      preHandler: [fastify.authenticate, fastify.authorize([UserRoles.ADMIN])],
    },
    productsController.addCategoryAttributes
  );

  done();
};

export default productsRoutes;
