import { addDays, format, lastDayOfWeek, startOfWeek } from "date-fns";
import { he } from "date-fns/locale";

export const DayInMonthNumber = ({ currentMonth }: { currentMonth: Date }) => {
  const startDate = startOfWeek(currentMonth, { weekStartsOn: 0 });
  const endDate = lastDayOfWeek(currentMonth, { weekStartsOn: 0 });
  const dateFormat = "d";
  const rows = [];
  let days = [];
  let day = startDate;
  let formattedDate = "";
  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      formattedDate = format(day, dateFormat, { locale: he });
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
      <div className="m-0 mr-[50px] flex flex-wrap p-0" key={day.toISOString()}>
        {days}
      </div>,
    );
    days = [];
  }
  return <div className="">{rows}</div>;
};
