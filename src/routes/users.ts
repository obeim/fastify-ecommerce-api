import { FastifyPluginCallback } from "fastify";
import usersController from "../controller/users";
import { UserRoles } from "../db/entity/User";

const usersRoutes: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.get(
    "/",
    {
      preHandler: [fastify.authenticate, fastify.authorize([UserRoles.ADMIN])],
    },
    usersController.getUsers
  );

  fastify.post(
    "/",
    {
      preHandler: [fastify.authenticate, fastify.authorize([UserRoles.ADMIN])],
    },
    usersController.createUser
  );

  fastify.get(
    "/:id",
    {
      preHandler: [fastify.authenticate, fastify.authorize([UserRoles.ADMIN])],
    },
    usersController.getUser
  );

  fastify.delete(
    "/:id",
    {
      preHandler: [fastify.authenticate, fastify.authorize([UserRoles.ADMIN])],
    },
    usersController.deleteUser
  );

  fastify.get(
    "/profile",
    { preHandler: [fastify.authenticate] },
    usersController.getProfile
  );

  done();
};

export default usersRoutes;
