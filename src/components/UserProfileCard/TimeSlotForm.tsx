"use-client";
import { useState, type FormEvent } from "react";
import { type DateValue } from "react-aria";
import { getErrorMessage } from "~/app/_utils/getErrorMessage";
import { DateTimePicker } from "../DateAndTimePicker/DateAndTimePicker";
import { Button } from "../ui/button";
import { submitForm } from "./TimeSloteFormAction";

export const TimeSlotForm = () => {
  const [serverError, setServerError] = useState<string | null>();
  const [firstTimeSlot, setFirstTimeSlot] = useState<DateValue>();
  const [secondTimeSlot, setSecondTimeSlot] = useState<DateValue>();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setServerError(null);
      if (!firstTimeSlot || !secondTimeSlot)
        throw new Error("לא נבחרו שני נקודות זמן");
      const firstDate = new Date(
        firstTimeSlot.year,
        firstTimeSlot.month - 1,
        firstTimeSlot.day,
        firstTimeSlot.hour,
        firstTimeSlot.minute,
      );
      const secondDate = new Date(
        secondTimeSlot.year,
        secondTimeSlot.month - 1,
        secondTimeSlot.day,
        secondTimeSlot.hour,
        secondTimeSlot.minute,
      );
      await submitForm(firstDate, secondDate);
      setFirstTimeSlot(undefined);
      setSecondTimeSlot(undefined);
    } catch (error) {
      setServerError(getErrorMessage(error));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-8 p-2">
      <label>
        מתחיל:
        <DateTimePicker
          isDateUnavailable={(value) => {
            const date = new Date(
              value.year,
              value.month - 1,
              value.day,
              value.hour,
              value.minute,
            );
            return date < new Date();
          }}
          value={firstTimeSlot}
          onChange={(value) => setFirstTimeSlot(value)}
          granularity={"minute"}
          shouldCloseOnSelect
        />
      </label>
      <label>
        נגמר:
        <DateTimePicker
          value={secondTimeSlot}
          onChange={(value) => setSecondTimeSlot(value)}
          isDateUnavailable={(value) => {
            const selectedTime = new Date(
              value.year,
              value.month - 1,
              value.day,
              value.hour,
              value.minute,
            );
            let dateToCompareTo;
            if (firstTimeSlot) {
              dateToCompareTo = new Date(
                firstTimeSlot.year,
                firstTimeSlot.month - 1,
                firstTimeSlot.day,
                firstTimeSlot.hour,
                firstTimeSlot.minute,
              );
            } else {
              dateToCompareTo = new Date();
            }
            return selectedTime < dateToCompareTo;
          }}
          granularity={"minute"}
          shouldCloseOnSelect
        />
      </label>
      {serverError && (
        <div className="text-sm font-bold text-red-500">{serverError}</div>
      )}
      <div className="flex items-center justify-start gap-4">
        <Button type="submit">שלח</Button>
      </div>
    </form>
  );
};
