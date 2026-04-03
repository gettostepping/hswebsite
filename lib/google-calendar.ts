import { google } from "googleapis"

/**
 * Google Calendar integration for HeartSaverNY.
 * Uses a Service Account to create events on the admin's calendar
 * and automatically invite the student as an attendee.
 * 
 * Required ENV vars:
 *   GOOGLE_SERVICE_ACCOUNT_EMAIL  – the service account email
 *   GOOGLE_SERVICE_ACCOUNT_KEY    – the private key (with \n newlines)
 *   GOOGLE_CALENDAR_ID            – the target calendar ID (usually admin's email)
 */

function getCalendarClient() {
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: (process.env.GOOGLE_SERVICE_ACCOUNT_KEY || "").replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/calendar"],
  })

  return google.calendar({ version: "v3", auth })
}

interface AddStudentEventParams {
  studentEmail: string
  studentName: string
  studentPhone?: string
  studentAddress?: string
  courseName: string
  courseCategory?: string
  date: Date
  startTime: string   // "09:00"
  endTime: string     // "13:00"
  location: string
  bookingId: string
}

/**
 * Creates a Google Calendar event for the student's registered class.
 * The student is added as an attendee so the event appears on their Google Calendar
 * with automatic email notification from Google.
 */
export async function addStudentToCalendar({
  studentEmail,
  studentName,
  studentPhone,
  studentAddress,
  courseName,
  courseCategory,
  date,
  startTime,
  endTime,
  location,
  bookingId,
}: AddStudentEventParams): Promise<{ eventId: string } | null> {
  try {
    // Skip if Google Calendar is not configured
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_SERVICE_ACCOUNT_KEY || !process.env.GOOGLE_CALENDAR_ID) {
      console.warn("Google Calendar not configured, skipping event creation")
      return null
    }

    const calendar = getCalendarClient()

    // Build ISO date-times from the class date + time strings
    const dateStr = date.toISOString().split("T")[0] // "2026-04-15"
    const startDateTime = `${dateStr}T${startTime}:00`
    const endDateTime = `${dateStr}T${endTime}:00`

    const event = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      requestBody: {
        summary: `${studentName} - ${courseName}`,
        description: [
          `🏥 HeartSaverNY Training Session`,
          ``,
          `Course: ${courseName}`,
          `Category: ${courseCategory || "Uncategorized"}`,
          `Student: ${studentName}`,
          `Email: ${studentEmail}`,
          `Phone: ${studentPhone || "Not provided"}`,
          `Address: ${studentAddress || "Not provided"}`,
          `Booking ID: ${bookingId}`,
          ``,
          `Please arrive 10 minutes early. Bring a valid photo ID.`,
          ``,
          `Questions? Contact us at info@heartsaverny.com or (718) 502-4816`,
        ].join("\n"),
        location,
        start: {
          dateTime: startDateTime,
          timeZone: "America/New_York",
        },
        end: {
          dateTime: endDateTime,
          timeZone: "America/New_York",
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: "email", minutes: 24 * 60 },  // 1 day before
            { method: "popup", minutes: 60 },         // 1 hour before
          ],
        },
        extendedProperties: {
          shared: {
            category: courseCategory || "uncategorized",
            bookingId: bookingId
          }
        }
      }
    })

    console.log(`Google Calendar event created: ${event.data.id} for ${studentEmail}`)
    return { eventId: event.data.id || "" }

  } catch (error: any) {
    console.error("Google Calendar event creation failed:", error?.message || error)
    // Don't throw — calendar is a nice-to-have, not a blocker
    return null
  }
}
