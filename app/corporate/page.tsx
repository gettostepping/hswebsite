import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { CorporateClient } from "./client";

export const metadata: Metadata = {
  title: "Corporate Training | HeartSaverNY",
  description:
    "Custom on-site group training and certification programs for businesses across New York City. Get an instant price estimate.",
};

async function getCourses() {
  try {
    return await prisma.course.findMany({
      where: { active: true },
      orderBy: { priceOriginal: "asc" },
      select: {
        id: true,
        title: true,
        priceOriginal: true,
        priceRenewal: true,
        category: true,
      },
    });
  } catch {
    return [];
  }
}

export default async function CorporatePage() {
  const courses = await getCourses();
  return <CorporateClient courses={courses} />;
}
