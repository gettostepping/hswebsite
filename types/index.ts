import { Course, ClassSession, Booking, User } from "@prisma/client";

export type CourseWithSessions = Course & {
  sessions: ClassSession[];
};

export type SessionWithCourse = ClassSession & {
  course: Course;
};

export type SessionWithCourseAndBookings = ClassSession & {
  course: Course;
  bookings: Booking[];
};

export type BookingWithDetails = Booking & {
  user: User;
  session: SessionWithCourse;
};

export interface ActionResponse<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface CalendarFilter {
  category?: string;
  month?: string;
  location?: string;
}
