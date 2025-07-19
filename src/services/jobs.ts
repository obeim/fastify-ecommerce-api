import { Params } from "fastify-cron";
import { LessThan } from "typeorm";
import { ProductView } from "../db/entity/ProductView";
import { AppDataSource } from "../db/data-source";

export const cleanProductViews: Params = {
  name: "Clean ProductViews",
  cronTime: "0 3 * * *",
  onTick: async () => {
    const cutoff = new Date(Date.now() - 1000 * 60 * 60 * 24 * 90);
    await AppDataSource.getRepository(ProductView).delete({
      viewedAt: LessThan(cutoff),
    });
  },
};
