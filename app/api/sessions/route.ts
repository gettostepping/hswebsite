import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const sessions = await prisma.classSession.findMany({
      where: {
        active: true,
        date: { gte: new Date() },
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            category: true,
            priceOriginal: true,
            duration: true,
          },
        },
      },
      orderBy: { date: "asc" },
    });

    return NextResponse.json(sessions);
  } catch (error) {
    console.error("Failed to fetch sessions:", error);
    return NextResponse.json([]);
  }
}
