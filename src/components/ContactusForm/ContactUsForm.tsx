"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { getErrorMessage } from "~/app/_utils/getErrorMessage";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "../ui/textarea";
import { addLeadToNotion } from "./addLeadToNotion";

export const formSchema = z.object({
  name: z
    .string()
    .min(5, {
      message: "חובה להזין שם מלא ",
    })
    .max(50, { message: "שם מלא יכול להכיל עד 50 תווים" }),
  email: z
    .string()
    .min(1, { message: "אימייל הוא שדה חובה" })
    .max(50, { message: "כתובת המייל לא יכולה להיות ארוכה מ 50 תווים" })
    .email("כתובת המייל שהוזנה אינה תקינה"),
  text: z.string().max(150, {
    message: "הטקסט לא יכול להכיל יותר מ 150 תווים",
  }),
});

export function ProfileForm() {
  const [serverError, setServerError] = useState<string | null>();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      text: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setServerError(null);
      await addLeadToNotion(values);
    } catch (error) {
      setServerError(getErrorMessage(error));
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>שם מלא:</FormLabel>
              <FormControl>
                <Input placeholder="אבי ישראלי" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>כתובת מייל:</FormLabel>
              <FormControl>
                <Input placeholder="avi_insraeli@gmail.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>טקסט חופשי:</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {serverError && <FormMessage>{serverError}</FormMessage>}
        <Button disabled={form.formState.isSubmitting} type="submit">
          שלח
        </Button>
      </form>
    </Form>
  );
}
