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
import { LoaderIcon } from "lucide-react";
import { useState } from "react";
import { useDebounceState } from "~/hooks/useDebounce";
import { fetchTimeSlots } from "./serverActions";

const getWeekDates = (date: Date) => {
  const startDate = startOfWeek(date, { weekStartsOn: 0 }); // Assuming week starts on Sunday
  const endDate = endOfWeek(date, { weekStartsOn: 0 });
  return { startDate, endDate };
};

const Calendar = ({ userID }: { userID: string }) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [debounceCurrentDate, currentDate, setCurrentDate] =
    useDebounceState<Date>(new Date(), 500);

  const { data, isLoading, error } = useQuery({
    queryKey: ["timeSlot", currentDate],
    queryFn: async () => {
      const { startDate, endDate } = getWeekDates(debounceCurrentDate);
      return await fetchTimeSlots({
        startTime: startDate,
        endTime: endDate,
        userID,
      });
    },
  });

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

  const renderHeader = () => {
    const dateFormat = "MMM yyyy";
    return (
      <div className="flex w-full py-5">
        <div className="max-w-full flex-1 basis-0 justify-start text-left">
          <div onClick={prevMonth}>prev month</div>
        </div>
        <div className="max-w-full flex-1 basis-0 justify-center text-center">
          <span>{format(currentMonth, dateFormat)}</span>
        </div>
        <div className="max-w-full flex-1 basis-0 justify-end text-right">
          <div onClick={nextMonth}>next month</div>
        </div>
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
      <div className="m-0 flex w-full flex-row flex-wrap p-0 py-1 font-normal uppercase text-slate-500/50">
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
        // const cloneDay = day;
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
          className="m-0 flex w-full flex-row flex-wrap p-0"
          key={day.toISOString()}
        >
          {days}
        </div>,
      );
      days = [];
    }
    return <div className="w-full">{rows}</div>;
  };
  const renderFooter = () => {
    return (
      <div className="flex-middle m-0 flex w-full cursor-pointer select-none flex-row flex-wrap py-5">
        <div
          onClick={prevWeek}
          className="max-w-full flex-1 basis-0 justify-start text-left"
        >
          <span>prev week</span>
        </div>
        <div className="max-w-full flex-1 basis-0 justify-center text-center">
          <span></span>
        </div>
        <div
          className="max-w-full flex-1 basis-0 cursor-pointer select-none justify-end text-right"
          onClick={nextWeek}
        >
          <span>next week</span>
        </div>
      </div>
    );
  };
  return (
    <div className="block w-full">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
      {isLoading && <LoaderIcon className="mx-auto animate-spin" />}
      {error && <div>{error.message}</div>}
      {!isLoading && !error && data ? (
        <div className="text-center">{JSON.stringify(data)}</div>
      ) : null}
      {renderFooter()}
    </div>
  );
};

export default Calendar;
