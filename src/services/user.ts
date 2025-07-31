import { DeepPartial } from "typeorm";
import { AppDataSource } from "../db/data-source";
import { User } from "../db/entity/User";
import { FastifyError } from "fastify";

const userRepository = AppDataSource.getRepository(User);

const createUser = async (user: DeepPartial<User>) => {
  const userExist = await userRepository.findOneBy({ email: user.email });
  if (userExist) {
    const error = new Error("User already exists") as FastifyError;
    error.statusCode = 400;
    throw error;
  }
  const newUser = userRepository.create(user);

  return await userRepository.save(newUser);
};

const deleteUser = async (id: string) => {
  const userExist = await userRepository.findOneBy({ id: parseInt(id) });

  if (!userExist) {
    const error = new Error("There is no such user") as FastifyError;
    error.statusCode = 404;
    throw error;
  }

  await userRepository.delete(id);
  return { message: "User removed successfully" };
};

const getUserById = async (id: string) => {
  const user = await userRepository.findOne({
    where: { id: parseInt(id) },
    select: ["email", "username", "firstName", "lastName", "age", "id"],
  });
  if (!user) {
    const error = new Error("User not found") as FastifyError;
    error.statusCode = 404;
    throw error;
  }
  return user;
};

export default { createUser, getUserById, deleteUser };
