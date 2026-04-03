import { addStudentToCalendar } from "../lib/google-calendar";
import fs from "fs";

// Load env
const envStr = fs.readFileSync(".env", "utf8");
envStr.split("\n").forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    let val = match[2].trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    process.env[match[1]] = val;
  }
});

async function runTest() {
  console.log("Testing Google Calendar creation...");
  const res = await addStudentToCalendar({
    studentEmail: "teststudent@example.com",
    studentName: "John Test",
    courseName: "Test BLS Provider",
    courseCategory: "AHA Certification",
    date: new Date("2026-05-15T12:00:00Z"),
    startTime: "09:00",
    endTime: "13:00",
    location: "Main Center",
    bookingId: "test-12345",
  });
  console.log("Result:", res);
}

runTest();
