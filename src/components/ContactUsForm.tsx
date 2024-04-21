"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { Textarea } from "./ui/textarea";

const formSchema = z.object({
  name: z
    .string()
    .min(5, {
      message: "חובה להזין שם מלא תקין",
    })
    .max(50, { message: "שם מלא יכול להכיל עד 50 תווים" }),
  email: z
    .string()
    .min(1, { message: "This field has to be filled." })
    .max(50, { message: "כתובת המייל לא יכולה להיות ארוכה מ 50 תווים" })
    .email("This is not a valid email."),
  text: z.string().max(150, {
    message: "Username must be at least 2 characters.",
  }),
});

export function ProfileForm() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      text: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
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
        <Button type="submit">שלח</Button>
      </form>
    </Form>
  );
}
