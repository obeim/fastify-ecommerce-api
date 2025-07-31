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

  done();
};

export default productsRoutes;
