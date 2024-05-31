import { google, type calendar_v3 } from "googleapis";

export const getUserCalendar = ({
  userOAuthToken,
}: {
  userOAuthToken: string;
}) =>
  google.calendar({
    version: "v3",
    headers: { Authorization: `Bearer ${userOAuthToken}` },
  });

export const createEvent = async ({
  event,
  calendar,
}: {
  calendar: calendar_v3.Calendar;
  event: calendar_v3.Schema$Event;
}) =>
  await calendar.events.insert({
    requestBody: event,
    calendarId: "primary",
    sendUpdates: "all",
  });
