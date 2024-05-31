import { addDays, addHours, addMinutes, startOfWeek } from "date-fns";

export const convertSelectedValuesToDate = ({
  currentDate,
  dayValue,
  hour,
  minutes,
}: {
  currentDate: Date;
  dayValue: number;
  hour: number;
  minutes: number;
}) => {
  const startDate = startOfWeek(currentDate, {
    weekStartsOn: 0,
  });
  const startDateWithDay = addDays(startDate, dayValue);
  const startDateWithHour = addHours(startDateWithDay, hour);
  const startTime = addMinutes(startDateWithHour, minutes);
  return startTime;
};

export const getMeetingEndTimeByStartTime = ({
  startTime,
}: {
  startTime: Date;
}) => {
  const endTime = addHours(startTime, 1);
  return endTime;
};
