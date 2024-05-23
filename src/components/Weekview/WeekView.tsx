import { useQuery } from "@tanstack/react-query";
import {
  addDays,
  addMonths,
  addWeeks,
  endOfWeek,
  format,
  lastDayOfWeek,
  startOfWeek,
  subMonths,
  subWeeks,
} from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  LoaderIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Tooltip } from "../ui/tooltip";
import { TimeSlotButton } from "./TimeSlot";
import { fetchTimeSlots } from "./serverActions";

const getWeekDates = (date: Date) => {
  const startDate = startOfWeek(date, { weekStartsOn: 0 }); // Assuming week starts on Sunday
  const endDate = endOfWeek(date, { weekStartsOn: 0 });
  return { startDate, endDate };
};

const Calendar = ({ userID }: { userID: string }) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const { data, isLoading, error } = useQuery({
    queryKey: ["timeSlot", currentDate],
    queryFn: async () => {
      const { startDate, endDate } = getWeekDates(currentDate);
      return await fetchTimeSlots({
        startTime: startDate,
        endTime: endDate,
        userID,
      });
    },
  });

  useEffect(() => {
    console.log({ data });
  }, [data]);

  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevWeek = () => {
    setCurrentDate(subWeeks(currentDate, 1));
    setCurrentMonth(subWeeks(currentMonth, 1));
  };

  const nextWeek = () => {
    setCurrentMonth(addWeeks(currentMonth, 1));
    setCurrentDate(addWeeks(currentDate, 1));
  };

  const today = () => {
    setCurrentMonth(new Date());
    setCurrentDate(new Date());
  };

  const renderHeader = () => {
    const dateFormat = "MMM yyyy";
    return (
      <div className="flex w-full items-center justify-evenly">
        <Tooltip content="לחודש הקודם">
          <Button size="icon" variant="outline" onClick={prevMonth}>
            <ChevronsRight />
          </Button>
        </Tooltip>
        <Tooltip content="לשבוע הקודם">
          <Button size="icon" variant="outline" onClick={prevWeek}>
            <ChevronRight />
          </Button>
        </Tooltip>
        <div className="justify-baseline flex max-w-full flex-col text-center">
          <span>{format(currentMonth, dateFormat)}</span>
          <Button size="sm" onClick={today}>
            <span>היום</span>
          </Button>
        </div>
        <Tooltip content="לשבוע הבא">
          <Button size="icon" variant="outline" onClick={nextWeek}>
            <ChevronLeft />
          </Button>
        </Tooltip>
        <Tooltip content="לחודש הבא">
          <Button size="icon" variant="outline" onClick={nextMonth}>
            <ChevronsLeft />
          </Button>
        </Tooltip>
      </div>
    );
  };
  const renderDays = () => {
    const dateFormat = "EEE";
    const days = [];
    const startDate = startOfWeek(currentMonth, { weekStartsOn: 0 }); // 0 is Sunday
    for (let i = 0; i < 7; i++) {
      days.push(
        <div
          className="max-w-full flex-1 basis-0 justify-center text-center"
          key={i}
        >
          {format(addDays(startDate, i), dateFormat)}
        </div>,
      );
    }
    return (
      <div className="m-0 mr-[50px] flex flex-wrap p-0 py-1 font-normal uppercase text-slate-500/50">
        {days}
      </div>
    );
  };

  const renderCells = () => {
    const startDate = startOfWeek(currentMonth, { weekStartsOn: 0 });
    const endDate = lastDayOfWeek(currentMonth, { weekStartsOn: 0 });
    const dateFormat = "d";
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        days.push(
          <div
            className="flex max-w-full flex-1 basis-0 justify-center"
            key={day.toISOString()}
          >
            {formattedDate}
          </div>,
        );
        day = addDays(day, 1);
      }

      rows.push(
        <div
          className="m-0 mr-[50px] flex flex-wrap p-0"
          key={day.toISOString()}
        >
          {days}
        </div>,
      );
      days = [];
    }
    return <div className="">{rows}</div>;
  };
  return (
    <div className="block">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
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
                        timeValue={timeValue}
                        currentDate={currentDate}
                        hour={hour}
                        minutes={minutes}
                        data={data}
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
