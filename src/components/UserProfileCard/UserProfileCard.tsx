import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { type UserProfile } from "~/types/trpcTypes";
import WeekView from "../Weekview/WeekView";
import { DialogContent } from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { EditUserProfileForm } from "./EditUserProfileForm";
import { UserProfileCard } from "./ReadOnlyProfileCard";
import { TimeSlotForm } from "./TimeSlotForm";

export const ProfileCard = ({ userProfile }: { userProfile: UserProfile }) => {
  const { user } = useUser();
  const validUserID =
    userProfile?.userID && user?.id && userProfile.userID === user.id;
  const [isEditMode, setEditMode] = useState<boolean>(false);

  if (!validUserID) return null;

  return (
    <DialogContent className="flex w-full flex-col items-center justify-start">
      <Tabs
        defaultValue="profile"
        className="flex w-full flex-col items-stretch justify-center"
      >
        <TabsList className="w-fit self-center">
          <TabsTrigger value="profile">פרופיל</TabsTrigger>
          <TabsTrigger value="schedule">לוח זמנים</TabsTrigger>
        </TabsList>
        <TabsContent className="w-full p-0" value="profile" dir="rtl">
          {isEditMode ? (
            <EditUserProfileForm
              userProfile={userProfile}
              cancelEdit={() => setEditMode(false)}
            />
          ) : (
            <UserProfileCard
              displayEdit={Boolean(validUserID) && !isEditMode}
              userProfile={userProfile}
              setEditMode={() => setEditMode(true)}
            />
          )}
        </TabsContent>
        <TabsContent value="schedule" dir="rtl">
          <TimeSlotForm />
          <WeekView userID={userProfile.userID} />
        </TabsContent>
      </Tabs>
    </DialogContent>
  );
};
