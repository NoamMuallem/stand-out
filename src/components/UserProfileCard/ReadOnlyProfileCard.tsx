import { useUser } from "@clerk/nextjs";
import { Pencil } from "lucide-react";
import { type UserProfile } from "~/types/trpcTypes";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

export const UserProfileCard = ({
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
      <div className="flex items-start justify-between gap-4">
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
        {displayEdit ? (
          <Button variant="ghost" size="icon" onClick={setEditMode}>
            <Pencil />
          </Button>
        ) : null}
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
