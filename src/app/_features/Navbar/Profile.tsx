import { SignOutButton, useUser } from "@clerk/nextjs";
import { LogOut, MessageSquareText, User } from "lucide-react";
import Link from "next/link";
import { ProfileCard } from "~/components/UserProfileCard/UserProfileCard";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Dialog, DialogTrigger } from "~/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { type UserProfile } from "~/types/trpcTypes";

export function Profile({ userProfile }: { userProfile: UserProfile }) {
  const { user } = useUser();
  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger
          asChild
          className="h-[2.25rem] w-[2.25rem] cursor-pointer"
        >
          <Avatar>
            <AvatarImage src={user?.imageUrl} alt="User Profile" />
            <AvatarFallback />
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <Link href="/user-profile">
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Account</span>
              </DropdownMenuItem>
            </Link>
          </DropdownMenuGroup>
          <SignOutButton>
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </SignOutButton>
          <DropdownMenuItem>
            <DialogTrigger className="flex w-full flex-row items-center justify-start">
              <MessageSquareText className="mr-2 h-4 w-4" />
              Profile
            </DialogTrigger>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ProfileCard userProfile={userProfile} />
    </Dialog>
  );
}
