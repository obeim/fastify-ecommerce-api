import "@fastify/jwt";
import { Type } from "@sinclair/typebox";
import { User } from "../db/entity/User";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: { id: number; username: string; role: string }; // payload type
    user: requestUser; // request.user type
  }
}
interface requestUser {
  id: number;
  username: string;
  role: string;
}

export const LoginSchema = {
  body: Type.Object({ email: Type.String(), password: Type.String() }),
  response: {
    201: {
      user: Type.Object<User>(),
      accessToken: Type.String(),
      refreshToken: Type.String(),
    },
  },
};
