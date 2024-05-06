import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { type UserProfile } from "~/types/trpcTypes";
import { DialogContent } from "../ui/dialog";
import { EditUserProfileForm } from "./EditUserProfileForm";
import { UserProfileCard } from "./ReadOnlyProfileCard";

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
