"use server";

import { revalidatePath } from "next/dist/server/web/spec-extension/revalidate-path";
import { type z } from "zod";
import { api } from "~/trpc/server";
import { type formSchema } from "./EditUserProfileForm";

export async function handleSubmit(values: z.infer<typeof formSchema>) {
  await api.userProfile.editProfile(values);
  revalidatePath("/");
}
