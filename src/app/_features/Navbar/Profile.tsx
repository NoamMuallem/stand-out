import { SignOutButton, useUser } from "@clerk/nextjs";
import { LogOut, User } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

export function Profile() {
  const { user } = useUser();

  return (
    <DropdownMenu dir="rtl">
      <DropdownMenuTrigger
        asChild
        className="h-[2.25rem] w-[2.25rem] cursor-pointer"
      >
        <Avatar>
          <AvatarImage src={user?.imageUrl} alt="User Profile" />
          <AvatarFallback />
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-min">
        <DropdownMenuGroup>
          <Link href="/user-profile">
            <DropdownMenuItem className="flex items-center justify-start gap-2">
              <User className="mr-2 h-4 w-4" />
              <span>חשבון</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <SignOutButton>
          <DropdownMenuItem className="flex items-center justify-start gap-2">
            <LogOut className="mr-2 h-4 w-4" />
            <span>התנתק</span>
          </DropdownMenuItem>
        </SignOutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
