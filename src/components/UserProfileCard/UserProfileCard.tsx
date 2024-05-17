import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { type UserProfile } from "~/types/trpcTypes";
import WeekView from "../Weekview/WeekView";
import { DialogContent } from "../ui/dialog";
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
    <DialogContent className="flex w-full flex-col items-start justify-start">
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
      <TimeSlotForm />
      <WeekView userID={userProfile.userID} />
    </DialogContent>
  );
};
