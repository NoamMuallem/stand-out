import {
  addDays,
  addMonths,
  addWeeks,
  format,
  getWeek,
  lastDayOfWeek,
  startOfWeek,
  subMonths,
  subWeeks,
} from "date-fns";
import { useState } from "react";

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [currentWeek, setCurrentWeek] = useState<number>(getWeek(currentMonth));

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevWeek = () => {
    setCurrentMonth(subWeeks(currentMonth, 1));
    setCurrentWeek(getWeek(subWeeks(currentMonth, 1)));
  };

  const nextWeek = () => {
    setCurrentMonth(addWeeks(currentMonth, 1));
    setCurrentWeek(getWeek(addWeeks(currentMonth, 1)));
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
            // onClick={() => {
            //   const dayStr = format(cloneDay, "ccc dd MMM yy");
            //   onDateClickHandle(cloneDay, dayStr);
            // }}
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
      {renderFooter()}
    </div>
  );
};

export default Calendar;
