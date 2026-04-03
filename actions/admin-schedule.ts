"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { google } from "googleapis";

// Define the schema inline
const sessionSchema = z.object({
  courseId: z.string().min(1),
  date: z.string().min(1), // YYYY-MM-DD
  startTime: z.string().min(1),
  endTime: z.string().min(1),
  capacity: z.coerce.number().min(1).max(100),
  location: z.string().min(2),
  instructorName: z.string().min(2),
  active: z.boolean().default(true),
});

// Configure Google API Auth
// This requires a service account JSON stored in the environment
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL || "test@test.com",
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n') || "KEY",
  },
  scopes: ["https://www.googleapis.com/auth/calendar.events"],
});

export async function createClassSession(formData: FormData) {
  try {
    const rawData = {
      courseId: formData.get("courseId") as string,
      date: formData.get("date") as string,
      startTime: formData.get("startTime") as string,
      endTime: formData.get("endTime") as string,
      capacity: formData.get("capacity"),
      location: formData.get("location") as string,
      instructorName: formData.get("instructorName") as string,
      active: formData.get("active") === "true",
    };

    const data = sessionSchema.parse(rawData);

    // Fetch the course to get the title for Google Calendar
    const course = await prisma.course.findUnique({
      where: { id: data.courseId },
    });
    
    if (!course) throw new Error("Course not found");

    // Convert date + time to ISO strings for Google Cal
    // Local processing based on America/New_York (can be parameterized later)
    const startTimeISO = new Date(`${data.date}T${data.startTime}:00`).toISOString();
    const endTimeISO = new Date(`${data.date}T${data.endTime}:00`).toISOString();

    let googleEventId = null;

    // Save to Database
    await prisma.classSession.create({
      data: {
        ...data,
        date: new Date(`${data.date}T12:00:00`), // Store noon to avoid timezone shift dropping dates
        googleEventId,
      },
    });

    revalidatePath("/admin/schedule");
    revalidatePath("/calendar");
    revalidatePath("/courses");
    return { success: true };
  } catch (err: any) {
    console.error("Schedule error:", err);
    return { success: false, error: err.message || "Failed to create class session" };
  }
}

export async function deleteClassSession(id: string) {
  try {
    const session = await prisma.classSession.findUnique({ where: { id } });
    if (!session) throw new Error("Session not found");

    if (session.googleEventId && process.env.GOOGLE_CALENDAR_ID && process.env.GOOGLE_PRIVATE_KEY) {
      const calendar = google.calendar({ version: "v3", auth });
      await calendar.events.delete({
        calendarId: process.env.GOOGLE_CALENDAR_ID,
        eventId: session.googleEventId,
      });
    }

    await prisma.classSession.delete({ where: { id } });
    revalidatePath("/admin/schedule");
    revalidatePath("/calendar");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: "Failed to delete schedule block" };
  }
}
