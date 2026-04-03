import { prisma } from "@/lib/db";
import { addDays, format, getDay, isSameDay, startOfDay } from "date-fns";

export type ScheduleRule = {
  frequency: "weekly" | "biweekly" | "daily";
  daysOfWeek: number[]; // 0 = Sunday, 1 = Monday, etc.
  startTime: string; // "09:00"
  endTime: string; // "13:00"
  capacity: number;
  location: string;
  instructorName: string;
  exceptionsAdded: string[]; // YYYY-MM-DD
  exceptionsRemoved: string[]; // YYYY-MM-DD
};

export async function syncCourseClassSessions(courseId: string, rule: ScheduleRule) {
  // 1. Generate all dates for the next 365 days
  const today = startOfDay(new Date());
  const endDate = addDays(today, 365);
  let currentDate = today;
  let validDates: Date[] = [];

  // 2. Compute normal occurrences
  while (currentDate <= endDate) {
    const dayOfWeek = getDay(currentDate);
    const dateStr = format(currentDate, "yyyy-MM-dd");

    let shouldAdd = false;

    if (rule.frequency === "daily") {
       shouldAdd = true;
    } else if (rule.frequency === "weekly") {
       shouldAdd = rule.daysOfWeek.includes(dayOfWeek);
    } else if (rule.frequency === "biweekly") {
       const weeksDiff = Math.floor((currentDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 7));
       if (weeksDiff % 2 === 0 && rule.daysOfWeek.includes(dayOfWeek)) {
           shouldAdd = true;
       }
    }

    if (shouldAdd) {
       validDates.push(new Date(currentDate));
    }
    currentDate = addDays(currentDate, 1);
  }

  // 3. Remove exceptions
  validDates = validDates.filter(d => !rule.exceptionsRemoved.includes(format(d, "yyyy-MM-dd")));

  // 4. Add exceptions
  for (const extraDateStr of rule.exceptionsAdded) {
    const extraDate = new Date(extraDateStr + "T00:00:00");
    if (!validDates.some(d => isSameDay(d, extraDate))) {
      validDates.push(extraDate);
    }
  }

  // 5. Fetch existing sessions to avoid dupes/overwrites
  const existingSessions = await prisma.classSession.findMany({
     where: { courseId, date: { gte: today } }
  });

  // 6. Create missing sessions
  const sessionsToCreate = [];
  for (const d of validDates) {
     const exists = existingSessions.some(s => isSameDay(s.date, d) && s.startTime === rule.startTime);
     if (!exists) {
        sessionsToCreate.push({
           courseId,
           date: d,
           startTime: rule.startTime,
           endTime: rule.endTime,
           capacity: rule.capacity,
           location: rule.location,
           instructorName: rule.instructorName,
           active: true,
        });
     }
  }

  if (sessionsToCreate.length > 0) {
     await prisma.classSession.createMany({
        data: sessionsToCreate
     });
  }
}
