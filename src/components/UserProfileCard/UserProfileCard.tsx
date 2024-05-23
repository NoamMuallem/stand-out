import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { type UserProfile } from "~/types/trpcTypes";
import WeekView from "../Weekview/WeekView";
import { Button } from "../ui/button";
import { DialogContent } from "../ui/dialog";
import { EditUserProfileForm } from "./EditUserProfileForm";
import { UserProfileCard } from "./ReadOnlyProfileCard";
import { TimeSlotForm } from "./TimeSlotForm";

export const ProfileCard = ({ userProfile }: { userProfile: UserProfile }) => {
  const { user } = useUser();
  const validUserID =
    userProfile?.userID && user?.id && userProfile.userID === user.id;
  const [isEditMode, setEditMode] = useState<boolean>(false);

  const [showMeeting, setShowMeeting] = useState(false);

  if (!validUserID) return null;

  return (
    <DialogContent className="flex w-full flex-col items-start justify-start">
      {!showMeeting ? (
        <div className="w-full">
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
          <Button type="button" onClick={() => setShowMeeting(true)}>
            פגישות ולוח זמנים
          </Button>
        </div>
      ) : (
        <div className="flex w-full flex-col gap-4">
          <TimeSlotForm />
          <WeekView userID={userProfile.userID} />
          <Button onClick={() => setShowMeeting(false)}>חזור</Button>
        </div>
      )}
    </DialogContent>
  );
};
