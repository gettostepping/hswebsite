import { prisma } from "@/lib/db";
import { HomePageClient } from "./page-client";

// Ensure dynamic rendering so we always get fresh stats from the DB
export const dynamic = 'force-dynamic';

async function getFeaturedCourses() {
  try {
    return await prisma.course.findMany({
      where: { active: true },
      take: 6,
      orderBy: { createdAt: "desc" },
    }); 
  } catch {
    return [];
  }
}

async function getStats() {
  try {
    const [courseCount, sessionCount] = await Promise.all([
      prisma.course.count({ where: { active: true } }),
      prisma.classSession.count({ where: { active: true } }),
    ]);
    return { courses: courseCount, sessions: sessionCount };
  } catch {
    return { courses: 6, sessions: 24 };
  }
}

export default async function HomePage() {
  const [courses, stats] = await Promise.all([
    getFeaturedCourses(),
    getStats(),
  ]);

  return <HomePageClient courses={courses} stats={stats} />;
}
