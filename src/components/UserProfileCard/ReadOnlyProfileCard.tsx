import { useUser } from "@clerk/nextjs";
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
