import { type TimeSlot } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { startOfWeek } from "date-fns";
import { memo } from "react";
import { getErrorMessage } from "~/app/_utils/getErrorMessage";
import { TimeSlotButton } from "./TimeSlot";
import { createMeeting } from "./serverActions";
import {
  convertSelectedValuesToDate,
  getMeetingEndTimeByStartTime,
} from "./utils";

type DifferentUsersTimerSlotButtonProps = {
  dayValue: number;
  timeValue: number;
  currentDate: Date;
  setMeetingWithUserID: string;
  data: TimeSlot[];
  setServerError: (error: string | undefined) => void;
  setHoverTimeSlot: (
    value: { timeValue: number; dayValue: number } | undefined,
  ) => void;
  groupHover: boolean;
  onMouseIn: () => void;
  onMouseOut: () => void;
};
const DifferentUsersTimeSlotButtonContent = ({
  onMouseIn,
  onMouseOut,
  groupHover,
  dayValue,
  timeValue,
  currentDate,
  setMeetingWithUserID,
  data,
  setServerError,
}: DifferentUsersTimerSlotButtonProps) => {
  const hour = Math.floor(timeValue / 2);
  const minutes = timeValue % 2 === 0 ? 0 : 30;
  const queryClient = useQueryClient();
  const onClick = async () => {
    const startTime = convertSelectedValuesToDate({
      currentDate,
      dayValue,
      hour,
      minutes,
    });

    const endTime = getMeetingEndTimeByStartTime({
      startTime,
    });
    try {
      setServerError(undefined);
      await createMeeting({
        startTime,
        endTime,
        userToMeetWithID: setMeetingWithUserID,
      });
      await queryClient.invalidateQueries({
        queryKey: ["timeSlot", startOfWeek(startTime)],
      });
    } catch (error) {
      setServerError(getErrorMessage(error));
    }
  };

  return (
    <TimeSlotButton
      dayValue={dayValue}
      currentDate={currentDate}
      hour={hour}
      minutes={minutes}
      data={data}
      onMouseIn={onMouseIn}
      onMouseOut={onMouseOut}
      groupHover={groupHover}
      onClick={onClick}
    />
  );
};

export const DifferentUsersTimeSlotButton = memo(
  DifferentUsersTimeSlotButtonContent,
);
