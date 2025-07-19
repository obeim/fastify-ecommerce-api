import { RouteHandlerMethod } from "fastify";
import userService from "../services/user";
import { DeepPartial } from "typeorm";
import { User } from "../db/entity/User";
import { requestUser } from "../types/auth";
import { paginate } from "../services/utils";
import { AppDataSource } from "../db/data-source";

const userRepository = AppDataSource.getRepository(User);

const getUsers: RouteHandlerMethod = async (request, reply) => {
  const { page = 1, offset = 10 } = request.params as {
    page?: number;
    offset?: number;
  };

  const result = await paginate(userRepository, {
    page: page,
    limit: offset,
    select: ["id", "email", "username", "role"],
  });
  return reply.send(result);
};

const createUser: RouteHandlerMethod = async (request, reply) => {
  const user = await userService.createUser(request.body as DeepPartial<User>);
  delete user.password;
  return reply.send(user);
};

const getUser: RouteHandlerMethod = async (request, reply) => {
  const { id } = request.params as { id: string };
  try {
    const user = await userService.getUserById(id);
    reply.send(user);
  } catch (error) {
    reply.status(401).send({ message: "Unauthorized" });
  }
};

const deleteUser: RouteHandlerMethod = async (request, reply) => {
  const { id } = request.params as { id: string };
  const user = await userService.deleteUser(id);
  reply.send(user);
};

const getProfile: RouteHandlerMethod = async (request, reply) => {
  const user = await userService.getUserById(
    (request.user as requestUser).id.toString()
  );
  reply.send(user);
};

export default { getUsers, createUser, getUser, deleteUser, getProfile };
