import { type TimeSlot } from "@prisma/client";
import { addDays, addHours, addMinutes, startOfWeek } from "date-fns";
import React, { useMemo } from "react";
import { Button } from "../ui/button";

const TimeSlotButtonContent = ({
  dayValue,
  currentDate,
  hour,
  minutes,
  data,
}: {
  dayValue: number;
  currentDate: Date;
  hour: number;
  minutes: number;
  data: TimeSlot[];
}) => {
  const selected = useMemo(() => {
    const startDate = startOfWeek(currentDate, {
      weekStartsOn: 0,
    });
    const dateWithDay = addDays(startDate, dayValue);
    const dateWithHour = addHours(dateWithDay, hour);
    const dateWithMinutes = addMinutes(dateWithHour, minutes);
    return data.find((timeSlot) => {
      return (
        dateWithMinutes.getTime() >= timeSlot.startTime.getTime() &&
        dateWithMinutes.getTime() < timeSlot.endTime.getTime()
      );
    });
  }, [currentDate, data, dayValue, hour, minutes]);

  return (
    <Button
      variant={selected ? "default" : "outline"}
      className="h-9 flex-1 basis-0"
    >
      {}
    </Button>
  );
};
export const TimeSlotButton = React.memo(TimeSlotButtonContent);
