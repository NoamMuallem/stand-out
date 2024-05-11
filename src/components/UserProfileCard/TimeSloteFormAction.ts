"use server";

import { revalidatePath } from "next/cache";
import { api } from "~/trpc/server";

export const submitForm = async (firstDate: Date, secondDate: Date) => {
  await api.timeSlotRouter.createTimeSlot({
    startTime: firstDate,
    endTime: secondDate,
  });
  revalidatePath("/");
};
