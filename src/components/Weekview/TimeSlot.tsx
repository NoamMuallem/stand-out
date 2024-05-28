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
  onClick,
  onMouseIn,
  onMouseOut,
  groupHover,
}: {
  onClick: () => void;
  dayValue: number;
  currentDate: Date;
  hour: number;
  minutes: number;
  data: TimeSlot[];
  onMouseIn: () => void;
  onMouseOut: () => void;
  groupHover: boolean;
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
      variant={
        !groupHover
          ? selected
            ? "default"
            : "outline"
          : selected && selected.isTaken === false
            ? "accent"
            : "destructive"
      }
      className={`h-9 flex-1 basis-0`}
      onClick={onClick}
      onMouseEnter={onMouseIn}
      onMouseLeave={onMouseOut}
    >
      {selected?.isTaken ? "M" : ""}
    </Button>
  );
};
export const TimeSlotButton = React.memo(TimeSlotButtonContent);
