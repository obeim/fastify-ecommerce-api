import { FastifyPluginCallback } from "fastify";
import auth from "../services/auth";
import { LoginSchema } from "../types/auth";
import { FastifyRequestTypebox } from "../types/fastify";

const authRoutes: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.get("/logout", async (request, reply) => {
    try {
      const response = await auth.logoutUser(request.user.id);
      reply.status(200).send(response);
    } catch (err) {
      throw err;
    }
  });

  fastify.post(
    "/login",
    async (request: FastifyRequestTypebox<typeof LoginSchema>, reply) => {
      try {
        const response = await auth.loginUser(
          request.body.email as string,
          request.body.password as string,
          fastify.jwt
        );
        reply.status(200).send(response);
      } catch (err) {
        throw err;
      }
    }
  );

  fastify.post("/refresh", async (request, reply) => {
    try {
      const accessToken = await auth.refreshUserToken(
        (request.body as { refreshToken: string }).refreshToken,
        fastify.jwt
      );
      reply.send({ accessToken });
    } catch (err) {
      throw err;
    }
  });

  done();
};

export default authRoutes;
