import {
  Repository,
  FindManyOptions,
  FindOptionsSelect,
  FindOptionsSelectByString,
} from "typeorm";

interface PaginateOptions<T> {
  page?: number;
  limit?: number;
  where?: FindManyOptions["where"];
  order?: FindManyOptions["order"];
  relations?: FindManyOptions<T>["relations"];
  select?: FindOptionsSelect<T> | FindOptionsSelectByString<T>;
}

interface PaginatedResult<T> {
  data: T[];
  current_page: number;
  next_page: number | null;
  total_pages: number;
  total_items: number;
}

export async function paginate<T>(
  repository: Repository<T>,
  options: PaginateOptions<T> = {}
): Promise<PaginatedResult<T>> {
  const page = Number(options.page ?? 1);
  const limit = options.limit ?? 10;
  const skip = (page - 1) * limit;

  const [data, total] = await repository.findAndCount({
    where: options.where,
    order: options.order,
    relations: options.relations,
    select: options.select,
    skip,
    take: limit,
  });

  const totalPages = Math.ceil(total / limit);

  return {
    data: data.map((item) => ({ ...item })),
    current_page: page,
    next_page: page < totalPages ? page + 1 : null,
    total_pages: totalPages,
    total_items: total,
  };
}
