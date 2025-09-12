"use client";

import React, { useEffect, useState } from "react";
import { Typography } from "~/components/ui/typography";
import { cn } from "~/lib/utils";
import { AppSession } from "~/types/session";
import { Avatar } from "../ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "~/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";
import { Button } from "../ui/button";
import Link from "next/link";
import { ThemeToggle } from "./ModeToggle";

type HeaderProps = {
  session: AppSession | null;
};
function Header({ session }: HeaderProps) {
  const headerHeight = 64;
  const [headerBg, setHeaderBg] = useState(false);
  const authed = !!session && !!session.user;
  console.log(session, authed);

  useEffect(() => {
    const trackingScroll = () => {
      if (window.scrollY > headerHeight + 20) {
        setHeaderBg(true);
      } else {
        setHeaderBg(false);
      }
    };

    trackingScroll();
    window.addEventListener("scroll", trackingScroll);

    return () => {
      window.removeEventListener("scroll", trackingScroll);
    };
  }, []);

  return (
    <header
      className={cn(
        "flex justify-between items-center w-full fixed top-0 h-16 px-16 border-b z-20",
        "transition-colors easy duration-500",
        headerBg ? "bg-background/90" : ""
      )}
    >
      <div className="header-branch">
        <Typography variant={"h3"} className="flex items-center gap-1">
          <Link href={"/"} className="font-light whitespace-nowrap">
            New feed
          </Link>{" "}
          <span className="hidden sm:block">
            |{" "}
            <Link
              href={"https://www.linkedin.com/in/hautrank2"}
              target="_blank"
              className="bg-foreground text-background rounded-full px-4"
            >
              hautrank2
            </Link>
          </span>
        </Typography>
      </div>
      <div className="header-search px-16"></div>
      <div className="header-extra flex items-center gap-4">
        <ThemeToggle />
        {/* <Nav /> */}
        {authed ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="flex items-center gap-2 rounded-full hover:opacity-90 focus:outline-none"
                aria-label="Open user menu"
              >
                <Avatar className="h-9 w-9">
                  {session!.user.image && (
                    <Image
                      src={session!.user.image}
                      alt={session!.user.name ?? "User"}
                      width={40}
                      height={40}
                    />
                  )}
                  <AvatarFallback>
                    {session.user.name.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">
                  {session!.user.name}
                </span>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="truncate">
                {session!.user.email ?? session!.user.name}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => signOut({ callbackUrl: "/" })}
                className="cursor-pointer"
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href="/auth">
            <Button
              variant={"ghost"}
              className="px-3 py-1.5 text-sm rounded-md border hover:bg-accent"
            >
              Sign in
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;
