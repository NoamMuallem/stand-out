import { useQuery } from "@tanstack/react-query";
import {
  addMonths,
  addWeeks,
  endOfWeek,
  startOfWeek,
  subMonths,
  subWeeks,
} from "date-fns";
import { useState } from "react";
import { fetchTimeSlots } from "./serverActions";

const getWeekDates = (date: Date) => {
  const startDate = startOfWeek(date, { weekStartsOn: 0 }); // Assuming week starts on Sunday
  const endDate = endOfWeek(date, { weekStartsOn: 0 });
  return { startDate, endDate };
};

export const useTimeSlots = ({ userID }: { userID: string }) => {
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

  return {
    today,
    nextMonth,
    nextWeek,
    prevMonth,
    prevWeek,
    currentMonth,
    currentDate,
    error,
    isLoading,
    data,
  };
};
