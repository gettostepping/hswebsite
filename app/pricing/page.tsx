import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { PricingClient } from "./client";

export const metadata: Metadata = {
  title: "Pricing & Packages",
  description:
    "View our competitive pricing for CPR, First Aid, BLS, ACLS, and PALS certification courses. Group discounts available.",
};

async function getCourses() {
  try {
    return await prisma.course.findMany({
      where: { active: true },
      orderBy: { priceOriginal: "asc" },
    });
  } catch {
    return [];
  }
}

export default async function PricingPage() {
  const courses = await getCourses();
  // Safe cast since we know the expected structure maps correctly to the client props
  return <PricingClient courses={courses as any} />;
}
