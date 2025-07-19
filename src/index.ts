import "reflect-metadata";
import Fastify, { FastifyInstance } from "fastify";
import fastifyHelmet from "@fastify/helmet";
import fastifyCompress from "@fastify/compress";
import fastifyBody from "@fastify/formbody";
import fastifyRateLimit from "@fastify/rate-limit";
import fastifyCron from "fastify-cron";

import config from "./config/config";
import { AppDataSource } from "./db/data-source";

import authPlugin from "./plugins/auth";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";

// routes
import authRoutes from "./routes/auth";
import usersRoutes from "./routes/users";
import productsRoutes from "./routes/products";
import { cleanProductViews } from "./services/jobs";

const start = async () => {
  const app: FastifyInstance = Fastify({
    logger: true,
  }).withTypeProvider<TypeBoxTypeProvider>();

  // Apply middleware
  app.register(fastifyHelmet);
  app.register(fastifyCompress);
  app.register(fastifyBody);
  app.register(fastifyRateLimit, {
    max: 100,
    timeWindow: "1 minute",
  });

  app.register(fastifyCron, {
    logLevel: "debug",
    jobs: [cleanProductViews],
  });

  await app.register(import("@fastify/swagger"));

  await app.register(import("@fastify/swagger-ui"), {
    routePrefix: "/api/docs",
    uiConfig: {
      docExpansion: "full",
      deepLinking: false,
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject, request, reply) => {
      return swaggerObject;
    },
    transformSpecificationClone: true,
  });

  try {
    // Database connection
    const dataSource = await AppDataSource.initialize();
    console.log("Database connected");
    await dataSource.runMigrations();
    console.log("Database migrations completed");
    // Start server
    app.register(authPlugin);
    app.register(authRoutes, { prefix: "/api/auth" });
    app.register(usersRoutes, { prefix: "/api/users" });
    app.register(productsRoutes, { prefix: "/api/products" });

    await app.listen({ port: config.port });
    app.cron.startAllJobs();
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
