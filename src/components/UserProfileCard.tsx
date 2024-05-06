import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { type UserProfile } from "~/types/trpcTypes";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { DialogContent } from "./ui/dialog";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

export const ProfileCard = ({ userProfile }: { userProfile: UserProfile }) => {
  const { user } = useUser();
  const canEdit = Boolean(
    userProfile?.userID && user?.id && userProfile.userID === user.id,
  );
  const [isEditMode, setEditMode] = useState<boolean>(false);

  return (
    <DialogContent className="flex w-full flex-col items-start justify-start">
      {isEditMode ? (
        <EditUserProfileForm
          userProfile={userProfile}
          cancelEdit={() => setEditMode(false)}
        />
      ) : (
        <UserProfileCard
          displayEdit={canEdit && !isEditMode}
          userProfile={userProfile}
          setEditMode={() => setEditMode(true)}
        />
      )}
    </DialogContent>
  );
};

const formSchema = z.object({
  userID: z.string(),
  background: z.string().optional(),
  lookingToImprove: z.string().optional(),
  firstName: z.string().optional(),
});

const EditUserProfileForm = ({
  cancelEdit,
  userProfile,
}: {
  cancelEdit: () => void;
  userProfile: UserProfile;
}) => {
  const { user } = useUser();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userID: user?.id,
      ...userProfile,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-8 p-2"
      >
        <Avatar>
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

const UserProfileCard = ({
  userProfile,
  displayEdit,
  setEditMode,
}: {
  userProfile: UserProfile;
  displayEdit: boolean;
  setEditMode: () => void;
}) => {
  const { user } = useUser();
  return (
    <div className="w-full space-y-8 p-2">
      {displayEdit ? <Button onClick={setEditMode}>Edit</Button> : null}
      <div className="flex items-start justify-start gap-4">
        <Avatar>
          <AvatarImage src={user?.imageUrl} alt="User Profile" />
          <AvatarFallback />
        </Avatar>
        <div className="flex flex-col items-start justify-start gap-1">
          <span>{userProfile?.firstName}</span>
          <span>{userProfile?.background}</span>
        </div>
      </div>
      <div>{`מספר ביקורות: ${userProfile?.amountOfRankings}`}</div>
      <div>{`ממוצע ביקורות: ${userProfile?.averageRanking}`}</div>
      <div className="flex flex-col items-start justify-start">
        <div>מחפש להשתפר ב</div>
        <div>{userProfile?.lookingToImprove}</div>
      </div>
    </div>
  );
};
