import { useQueryClient } from "@tanstack/react-query";
import { startOfWeek } from "date-fns";
import { LoaderIcon } from "lucide-react";
import { useState } from "react";
import { getErrorMessage } from "~/app/_utils/getErrorMessage";
import { Controls } from "./Controls";
import { DayInMonthNumber } from "./DayInMonthNumber";
import { DaysSymbol } from "./DaysSymbol";
import { TimeSlotButton } from "./TimeSlot";
import { useTimeSlots } from "./hooks";
import { createMeeting } from "./serverActions";
import {
  convertSelectedValuesToDate,
  getMeetingEndTimeByStartTime,
} from "./utils";

const Calendar = ({ userID }: { userID: string }) => {
  const [hoverTimeSlot, setHoverTimeSlot] = useState<
    { timeValue: number; dayValue: number } | undefined
  >();
  const [serverError, setServerError] = useState<string>();
  const {
    nextMonth,
    nextWeek,
    prevMonth,
    prevWeek,
    today,
    currentMonth,
    currentDate,
    isLoading,
    error,
    data,
  } = useTimeSlots({
    userID,
  });
  const queryClient = useQueryClient();

  return (
    <div className="block w-full">
      <Controls
        nextMonth={nextMonth}
        nextWeek={nextWeek}
        prevMonth={prevMonth}
        prevWeek={prevWeek}
        today={today}
        currentMonth={currentMonth}
      />
      {serverError && (
        <div className="font-bold text-red-500">{serverError}</div>
      )}
      <DaysSymbol currentMonth={currentMonth} />
      <DayInMonthNumber currentMonth={currentMonth} />
      {isLoading && <LoaderIcon className="mx-auto animate-spin" />}
      {error && <div>{error.message}</div>}
      <div className="flex max-h-[50vh] flex-col overflow-auto scrollbar-hide">
        <div className="flex flex-col gap-1.5 pt-3">
          {data &&
            Array.from(Array(48).keys()).map((timeValue) => {
              const hour = Math.floor(timeValue / 2);
              const minutes = timeValue % 2 === 0 ? 0 : 30;
              return (
                <div className="relative flex flex-col" key={timeValue}>
                  <div className="pointer-events-none absolute -top-[15px] flex w-full">
                    <div>{`${hour}:${minutes === 0 ? "00" : "30"}`}</div>
                    <div className="pointer-events-none my-auto h-[1px] w-full bg-slate-400"></div>
                  </div>
                  <div className="m-0 mr-[50px] flex flex-row flex-wrap gap-2 p-0">
                    {Array.from(Array(7).keys()).map((dayValue) => (
                      <TimeSlotButton
                        key={timeValue + dayValue}
                        dayValue={dayValue}
                        currentDate={currentDate}
                        hour={hour}
                        minutes={minutes}
                        data={data}
                        onMouseIn={() =>
                          setHoverTimeSlot({ timeValue, dayValue })
                        }
                        onMouseOut={() => setHoverTimeSlot(undefined)}
                        groupHover={Boolean(
                          hoverTimeSlot &&
                            dayValue === hoverTimeSlot.dayValue &&
                            timeValue <= hoverTimeSlot.timeValue + 2 &&
                            timeValue >= hoverTimeSlot.timeValue,
                        )}
                        onClick={async () => {
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
                              userToMeetWithID: userID,
                            });
                            await queryClient.invalidateQueries({
                              queryKey: ["timeSlot", startOfWeek(startTime)],
                            });
                          } catch (error) {
                            setServerError(getErrorMessage(error));
                          }
                        }}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
