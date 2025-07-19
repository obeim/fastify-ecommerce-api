import { AppDataSource } from "../db/data-source";
import { User } from "../db/entity/User";
import { FastifyError } from "fastify";
import bcrypt from "bcrypt";
import { JWT } from "@fastify/jwt";

const userRepository = AppDataSource.getRepository(User);

export const loginUser = async (
  email: string,
  password: string,
  jwt: JWT
): Promise<{ user: User; accessToken: string; refreshToken: string }> => {
  const user = await userRepository.findOne({
    where: { email },
    select: ["email", "password", "role", "id", "username"],
  });
  if (!user) {
    const error = new Error("Invalid credentials") as FastifyError;
    error.statusCode = 401;
    throw error;
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    const error = new Error("Invalid credentials") as FastifyError;
    error.statusCode = 401;
    throw error;
  }
  try {
    const payload = jwt.verify(user.refreshToken);
    if (payload)
      return {
        user,
        accessToken: jwt.sign(
          { id: user.id, username: user.username, role: user.role },
          { expiresIn: "1d" }
        ),
        refreshToken: user.refreshToken,
      };
  } catch (err) {
    const accessToken = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      { expiresIn: "1d" }
    );

    const refreshToken = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      { expiresIn: "7d" }
    );

    user.refreshToken = refreshToken;
    await userRepository.save(user);

    return { user, accessToken, refreshToken };
  }
};

export const refreshUserToken = async (
  refreshToken: string,
  jwt: any
): Promise<string> => {
  try {
    const payload = jwt.verify(refreshToken) as {
      id: number;
      username: string;
      role: string;
    };

    const user = await userRepository.findOneBy({ id: payload.id });

    if (!user || user.refreshToken !== refreshToken) {
      const error = new Error("Invalid refresh token") as FastifyError;
      error.statusCode = 401;
      throw error;
    }

    return jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      { expiresIn: "1d" }
    );
  } catch (err) {
    const error = new Error("Invalid or expired refresh token") as FastifyError;
    error.statusCode = 401;
    throw error;
  }
};

export const logoutUser = async (userId: number) => {
  const user = await userRepository.findOneBy({ id: userId });
  if (!user) {
    const error = new Error("User not found") as FastifyError;
    error.statusCode = 404;
    throw error;
  }
  user.refreshToken = null;
  await userRepository.save(user);

  return { message: "Logged out successfully" };
};

export default { loginUser, refreshUserToken, logoutUser };
