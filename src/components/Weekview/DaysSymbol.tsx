import { addDays, format, startOfWeek } from "date-fns";
import { he } from "date-fns/locale";

export const DaysSymbol = ({ currentMonth }: { currentMonth: Date }) => {
  const dateFormat = "EEE";
  const days = [];
  const startDate = startOfWeek(currentMonth, { weekStartsOn: 0 }); // 0 is Sunday
  for (let i = 0; i < 7; i++) {
    days.push(
      <div
        className="max-w-full flex-1 basis-0 justify-center text-center"
        key={i}
      >
        {format(addDays(startDate, i), dateFormat, { locale: he })}
      </div>,
    );
  }
  return (
    <div className="m-0 mr-[50px] flex flex-wrap p-0 py-1 font-normal uppercase text-slate-500/50">
      {days}
    </div>
  );
};
