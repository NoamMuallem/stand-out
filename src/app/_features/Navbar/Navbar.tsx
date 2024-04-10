"use client";

import { useAuth } from "@clerk/nextjs";
import { Dialog, DialogClose } from "@radix-ui/react-dialog";
import { LogIn, Menu, Rocket } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "~/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu";
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { cn } from "~/lib/utils";
import { Profile } from "./Profile";

const BRAND_NAME = "סטנדאוט";
const DRAWER_DESCRIPTION = "Plan, Build & Scale.";

const links: Array<{ label: string; href: string }> = [
  { label: "מאגר שאלות", href: "/questions-db" },
  { label: "קבע ראיון", href: "/interview" },
  { label: "בלוג", href: "/blog" },
] as const;

export function NavBar() {
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
        <ControlPanelWithDrawer />
      </NavigationMenu>
    </div>
  );
}

const DrawerLinks = ({ href, label }: { href: string; label: string }) => (
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

const AuthButton = () => {
  const { userId } = useAuth();
  return userId ? (
    <Profile />
  ) : (
    <Link
      className={buttonVariants({ size: "icon", variant: "outline" })}
      href="/sign-in"
    >
      <LogIn />
    </Link>
  );
};

const ControlPanelWithDrawer = () => {
  return (
    <div className="flex items-center gap-3">
      <AuthButton />
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
            <DrawerLinks href="/" label="בית" />
            {links.map(({ label, href }) => (
              <DrawerLinks href={href} label={label} key={href} />
            ))}
          </div>
        </SheetContent>
      </Dialog>
    </div>
  );
};

const HeaderLink = ({ label, href }: { label: string; href: string }) => (
  <NavigationMenuItem>
    <Link href={href} legacyBehavior passHref className="cursor-pointer">
      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
        {label}
      </NavigationMenuLink>
    </Link>
  </NavigationMenuItem>
);
