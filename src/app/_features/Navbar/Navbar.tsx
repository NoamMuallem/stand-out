"use client";

import { useAuth } from "@clerk/nextjs";
import { Dialog, DialogClose } from "@radix-ui/react-dialog";
import { LogIn, Menu, Rocket } from "lucide-react";
import Link from "next/link";
import * as React from "react";
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
import { ModeToggle } from "./ModeToggler";
import { Profile } from "./Profile";

export function NavBar() {
  const { userId } = useAuth();

  return (
    <div className="z-10 flex min-w-full justify-between border-b p-2">
      <NavigationMenu className="flex flex-1 items-center justify-between px-4">
        <Link
          href="/"
          className="text-md flex cursor-pointer items-center justify-center gap-2 pl-2 font-bold"
        >
          <Rocket /> Stand out
        </Link>
        <NavigationMenuList className="max-[825px]:hidden ">
          <NavigationMenuItem>
            <Link
              href="/contact-us"
              legacyBehavior
              passHref
              className="cursor-pointer"
            >
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                About
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link
              href="/contact-us"
              legacyBehavior
              passHref
              className="cursor-pointer"
            >
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Contact
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
        <div className="flex items-center gap-3">
          <ModeToggle />
          {userId ? (
            <Profile />
          ) : (
            <Link
              className={buttonVariants({ size: "icon", variant: "outline" })}
              href="/sign-in"
            >
              <LogIn />
            </Link>
          )}
          <Dialog>
            <SheetTrigger className="transition min-[825px]:hidden">
              <Button asChild variant="outline" size="icon">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Stand out</SheetTitle>
                <SheetDescription>Plan, Build & Scale.</SheetDescription>
              </SheetHeader>
              <div className="mt-[1rem] flex flex-col space-y-3">
                <DialogClose asChild>
                  <Link
                    className={cn(
                      buttonVariants({ size: "icon", variant: "outline" }),
                      "w-full",
                    )}
                    href="/"
                  >
                    Home
                  </Link>
                </DialogClose>
                <DialogClose asChild>
                  <Link
                    className={cn(
                      buttonVariants({ size: "icon", variant: "outline" }),
                      "w-full",
                    )}
                    href="/contact-us"
                  >
                    Contact
                  </Link>
                </DialogClose>
                <DialogClose asChild>
                  <Link
                    className={cn(
                      buttonVariants({ size: "icon", variant: "outline" }),
                      "w-full",
                    )}
                    href="/about"
                  >
                    About
                  </Link>
                </DialogClose>
              </div>
            </SheetContent>
          </Dialog>
        </div>
      </NavigationMenu>
    </div>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
