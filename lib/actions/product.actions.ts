"use server";
import { PrismaClient } from "@/lib/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { converToPlainObject } from "../utils";
import { LATEST_PRODUCTS_LIMIT } from "../constants";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

// Get latest products
export async function getLatestProducts() {
  const prisma = new PrismaClient({ adapter });

  const data = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: { createdAt: "desc" },
  });

  return converToPlainObject(data);
}
