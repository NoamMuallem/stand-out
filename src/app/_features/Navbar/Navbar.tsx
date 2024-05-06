"use client";

import { useAuth } from "@clerk/nextjs";
import { Dialog, DialogClose } from "@radix-ui/react-dialog";
import { LogIn, Menu, Rocket } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "~/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "~/components/ui/navigation-menu";
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { cn } from "~/lib/utils";
import { type UserProfile } from "~/types/trpcTypes";
import { Profile } from "./Profile";

const BRAND_NAME = "סטנדאוט";
const DRAWER_DESCRIPTION = "Plan, Build & Scale.";

const links: Array<{ label: string; href: string }> = [
  { label: "מאגר שאלות", href: "/questions-db" },
  { label: "קבע ראיון", href: "/interview" },
  { label: "בלוג", href: "/blog" },
] as const;

export function NavBar({ userProfile }: { userProfile: UserProfile }) {
  return (
    <div className="z-10 flex min-w-full justify-between border-b p-2">
      <NavigationMenu className="flex flex-1 items-center justify-between px-4">
        <Link
          href="/"
          className="text-md flex cursor-pointer items-center justify-center gap-2 pl-2 font-bold"
        >
          <Rocket />
          {BRAND_NAME}
        </Link>
        <NavigationMenuList className="max-[825px]:hidden ">
          {links.map(({ label, href }) => (
            <HeaderLink href={href} label={label} key={href} />
          ))}
        </NavigationMenuList>
        <ControlPanelWithDrawer userProfile={userProfile} />
      </NavigationMenu>
    </div>
  );
}

const DrawerLink = ({ href, label }: { href: string; label: string }) => (
  <DialogClose asChild>
    <Link
      className={cn(
        buttonVariants({ size: "icon", variant: "outline" }),
        "w-full",
      )}
      href={href}
    >
      {label}
    </Link>
  </DialogClose>
);

const AuthButton = ({ userProfile }: { userProfile: UserProfile }) => {
  const { userId } = useAuth();
  return userId ? (
    <Profile userProfile={userProfile} />
  ) : (
    <Link
      className={buttonVariants({ size: "icon", variant: "outline" })}
      href="/sign-in"
    >
      <LogIn />
    </Link>
  );
};

const ControlPanelWithDrawer = ({
  userProfile,
}: {
  userProfile: UserProfile;
}) => {
  return (
    <div className="flex items-center gap-3">
      <AuthButton userProfile={userProfile} />
      <Dialog>
        <SheetTrigger className="transition min-[825px]:hidden">
          <Button asChild variant="outline" size="icon" className="p-[7px]">
            <Menu size="24px" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>{BRAND_NAME}</SheetTitle>
            <SheetDescription>{DRAWER_DESCRIPTION}</SheetDescription>
          </SheetHeader>
          <div className="mt-[1rem] flex flex-col space-y-3">
            <DrawerLink href="/" label="בית" />
            {links.map(({ label, href }) => (
              <DrawerLink href={href} label={label} key={href} />
            ))}
          </div>
        </SheetContent>
      </Dialog>
    </div>
  );
};

const HeaderLink = ({ label, href }: { label: string; href: string }) => (
  <NavigationMenuItem>
    <Link
      className={cn(buttonVariants({ variant: "ghost" }))}
      href={href}
      passHref
    >
      {label}
    </Link>
  </NavigationMenuItem>
);
