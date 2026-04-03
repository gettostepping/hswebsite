import { google } from "googleapis";
import fs from "fs";

const envStr = fs.readFileSync(".env", "utf8");
envStr.split("\n").forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    let val = match[2].trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    process.env[match[1]] = val;
  }
});
async function testCalendar() {
  try {
    console.log("Using email:", process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL);
    console.log("Target Calendar:", process.env.GOOGLE_CALENDAR_ID);
    
    // Check key format
    const rawKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY || "";
    const key = rawKey.replace(/\\n/g, "\n");
    console.log("Key length:", key.length, "Starts with:", key.substring(0, 30));

    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key,
      scopes: ["https://www.googleapis.com/auth/calendar"],
    });

    const calendar = google.calendar({ version: "v3", auth });

    // Test list first to see if we have access
    console.log("Attempting to list events to verify access...");
    const res = await calendar.events.list({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      maxResults: 1,
    });
    console.log("Success! Found", res.data.items?.length, "events.");

  } catch (err: any) {
    console.error("\n--- ERROR ---");
    console.error(err.message || err);
    if (err.response) {
      console.error(err.response.data);
    }
  }
}

testCalendar();
