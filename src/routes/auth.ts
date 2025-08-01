import { FastifyPluginCallback } from "fastify";
import auth from "../services/auth";
import { LoginSchema } from "../types/auth";
import { FastifyRequestTypebox } from "../types/fastify";

const authRoutes: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.get("/logout", async (request, reply) => {
    const response = await auth.logoutUser(request.user.id);
    reply.status(200).send(response);
  });

  fastify.post(
    "/login",
    async (request: FastifyRequestTypebox<typeof LoginSchema>, reply) => {
      const response = await auth.loginUser(
        request.body.email as string,
        request.body.password as string,
        fastify.jwt
      );
      reply.status(200).send(response);
    }
  );

  fastify.post("/refresh", async (request, reply) => {
    const accessToken = await auth.refreshUserToken(
      (request.body as { refreshToken: string }).refreshToken,
      fastify.jwt
    );
    reply.send({ accessToken });
  });

  done();
};

export default authRoutes;
