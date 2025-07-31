import { FastifyPluginCallback } from "fastify";
import categoriesController from "../controller/categories";
import { UserRoles } from "../db/entity/User";

const categoriesRoutes: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.get(
    "/",
    { preHandler: [fastify.authenticate] },
    categoriesController.getCategories
  );

  fastify.post(
    "/",
    {
      preHandler: [fastify.authenticate, fastify.authorize([UserRoles.ADMIN])],
    },
    categoriesController.addCategory
  );

  fastify.get(
    "/:id",
    {
      preHandler: [fastify.authenticate],
    },
    categoriesController.getCategory
  );

  fastify.post(
    "/:id/attributes",
    {
      preHandler: [fastify.authenticate, fastify.authorize([UserRoles.ADMIN])],
    },
    categoriesController.addCategoryAttributes
  );

  done();
};
export default categoriesRoutes;
