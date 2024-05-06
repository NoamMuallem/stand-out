import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { type UserProfile } from "~/types/trpcTypes";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { handleSubmit } from "./userProfileCardAction";

export const formSchema = z.object({
  userID: z.string(),
  background: z.string().optional(),
  lookingToImprove: z.string().optional(),
  firstName: z.string().optional(),
});

export const EditUserProfileForm = ({
  cancelEdit,
  userProfile,
}: {
  cancelEdit: () => void;
  userProfile: UserProfile;
}) => {
  const [serverError, setServerError] = useState<string | null>();
  const { user } = useUser();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userID: user?.id,
      ...userProfile,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setServerError(null);
      await handleSubmit(values);
      cancelEdit();
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
        className="w-full space-y-8 p-2"
      >
        <Avatar className="min-h-[52px] min-w-[52px]">
          <AvatarImage src={user?.imageUrl} alt="User Profile" />
          <AvatarFallback />
        </Avatar>
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>שם פרטי</FormLabel>
              <FormControl>
                <Input placeholder="שאולי" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="background"
          render={({ field }) => (
            <FormItem>
              <FormLabel>רקע</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="מנהל מוצר עם 5 שנות ניסיון..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lookingToImprove"
          render={({ field }) => (
            <FormItem>
              <FormLabel>מחפש להשתפר ב</FormLabel>
              <FormControl>
                <Textarea placeholder="ניהול זמנים ופרודקט סנס" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {serverError && <FormMessage>{serverError}</FormMessage>}
        <div className="flex items-center justify-start gap-4">
          <Button type="submit">שלח</Button>
          <Button variant="secondary" type="submit" onClick={cancelEdit}>
            בטל
          </Button>
        </div>
      </form>
    </Form>
  );
};
