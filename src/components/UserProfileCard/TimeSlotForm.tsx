"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { startOfWeek } from "date-fns";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { getErrorMessage } from "~/app/_utils/getErrorMessage";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { submitForm } from "./TimeSloteFormAction";

const minutesOption = ["00", "30"];
const hoursOption = [
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
  "23",
  "00",
  "01",
  "02",
  "03",
  "04",
  "05",
];

export const formSchema = z
  .object({
    date: z.string(),
    startHour: z.string(),
    startMinutes: z.string(),
    endHour: z.string(),
    endMinutes: z.string(),
  })
  .refine((data) => Number(data.endHour) > Number(data.startHour), {
    message: "שעת סיום חייבת להיות אחרי שעת התחלה",
    path: ["endHour"], // Pointing out which field is invalid
  });

export const TimeSlotForm = () => {
  const queryClient = useQueryClient();
  const [serverError, setServerError] = useState<string | null>();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      startHour: "06",
      startMinutes: "00",
      endHour: "08",
      endMinutes: "30",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setServerError(null);
      const startTime = new Date(
        new Date(
          new Date(values.date).setHours(Number(values.startHour)),
        ).setMinutes(Number(values.startMinutes)),
      );
      const endTime = new Date(
        new Date(
          new Date(values.date).setHours(Number(values.endHour)),
        ).setMinutes(Number(values.endMinutes)),
      );
      await submitForm(startTime, endTime);
      form.reset();
      await queryClient.invalidateQueries({
        queryKey: ["timeSlot", startOfWeek(values.date)],
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.error(errorMessage);
      setServerError(errorMessage);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col items-center justify-start gap-1"
      >
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>תאריך:</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="date"
                  className="w-full"
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) =>
                    field.onChange(
                      new Date(e.target.value).toISOString().split("T")[0],
                    )
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex w-full flex-row flex-wrap items-center justify-between">
          <div className="flex flex-1 flex-col items-start justify-start">
            <span>שעה התחלה</span>
            <div className="flex flex-row items-start justify-start gap-1">
              <FormField
                control={form.control}
                name="startMinutes"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>דקות:</FormLabel>
                    <FormControl>
                      <Select
                        {...field}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-[80px]">
                          <SelectValue placeholder="דקות" />
                        </SelectTrigger>
                        <SelectContent>
                          {minutesOption.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="startHour"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>שעה:</FormLabel>
                    <FormControl>
                      <Select
                        {...field}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-[80px]">
                          <SelectValue placeholder="שעה" />
                        </SelectTrigger>
                        <SelectContent>
                          {hoursOption.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex flex-col items-start justify-start">
            <span>שעת סיום</span>
            <div className="flex w-full flex-row items-start justify-start gap-1">
              <FormField
                control={form.control}
                name="endMinutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>דקות:</FormLabel>
                    <FormControl>
                      <Select
                        {...field}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-[80px]">
                          <SelectValue placeholder="דקות" />
                        </SelectTrigger>
                        <SelectContent>
                          {minutesOption.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endHour"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>שעה:</FormLabel>
                    <FormControl>
                      <Select
                        {...field}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-[80px]">
                          <SelectValue placeholder="שעה" />
                        </SelectTrigger>
                        <SelectContent>
                          {hoursOption.map((option) => (
                            <SelectItem
                              disabled={
                                Number(form.getValues().startHour) >=
                                Number(option)
                              }
                              key={option}
                              value={option}
                            >
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
        {serverError && <FormMessage>{serverError}</FormMessage>}
        <Button>שמור</Button>
      </form>
    </Form>
  );
};
