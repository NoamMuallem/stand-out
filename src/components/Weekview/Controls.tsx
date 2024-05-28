import { format } from "date-fns";
import { he } from "date-fns/locale";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "../ui/button";
import { Tooltip } from "../ui/tooltip";

export const Controls = ({
  nextMonth,
  nextWeek,
  prevMonth,
  prevWeek,
  today,
  currentMonth,
}: {
  nextMonth: () => void;
  nextWeek: () => void;
  prevMonth: () => void;
  prevWeek: () => void;
  today: () => void;
  currentMonth: Date;
}) => {
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
        <span>{format(currentMonth, dateFormat, { locale: he })}</span>
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
