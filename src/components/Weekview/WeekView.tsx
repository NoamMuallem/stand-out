import { useAuth } from "@clerk/clerk-react";
import { LoaderIcon } from "lucide-react";
import { useState } from "react";
import { Controls } from "./Controls";
import { DayInMonthNumber } from "./DayInMonthNumber";
import { DaysSymbol } from "./DaysSymbol";
import { DifferentUsersTimeSlotButton } from "./differentUsersTimeslotButton";
import { useTimeSlots } from "./hooks";

const Calendar = ({ userID }: { userID: string }) => {
  const [hoverTimeSlot, setHoverTimeSlot] = useState<
    { timeValue: number; dayValue: number } | undefined
  >();
  const [serverError, setServerError] = useState<string>();
  const { userId: sessionUserID } = useAuth();
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

  const differentUser = sessionUserID
    ? userID.localeCompare(sessionUserID)
    : false;

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
                    {Array.from(Array(7).keys()).map((dayValue) => {
                      // This logic is reusable across all kinds of timeSlotsButton, but we need to memorize it
                      const groupHover = Boolean(
                        hoverTimeSlot &&
                          dayValue === hoverTimeSlot.dayValue &&
                          timeValue <= hoverTimeSlot.timeValue + 2 &&
                          timeValue >= hoverTimeSlot.timeValue,
                      );
                      const onMouseIn = () =>
                        setHoverTimeSlot({ timeValue, dayValue });
                      const onMouseOut = () => setHoverTimeSlot(undefined);

                      // TODO: use "differentUser" to determine the type of timeSlotButton and its actions
                      return (
                        <DifferentUsersTimeSlotButton
                          key={timeValue + dayValue}
                          groupHover={groupHover}
                          dayValue={dayValue}
                          timeValue={timeValue}
                          currentDate={currentDate}
                          setMeetingWithUserID={userID}
                          onMouseIn={onMouseIn}
                          onMouseOut={onMouseOut}
                          data={data}
                          setServerError={setServerError}
                          setHoverTimeSlot={setHoverTimeSlot}
                        />
                      );
                    })}
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
