"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { locationQueries } from "@/api-queries/location";
import { useQuery } from "@tanstack/react-query";
import { getEmirates } from "@/app/api/location";
import SideMenu from "./SideMenu";
import { SearchAnimated } from "./ai-search-bar";
import PostAdDialog from "../../app/(root)/post-ad/_components/PostAdDialog";
import { ICONS } from "@/constants/icons";
import { cn } from "@/lib/utils";

const Navbar = ({ className }: { className?: string }) => {
  const [city, setCity] = useState("");
  const [isPostAdDialogOpen, setIsPostAdDialogOpen] = useState(false);
  // const { data: emirates } = useQuery({
  //   queryKey: [locationQueries.emirates.key],
  //   queryFn: getEmirates,
  // });

  return (
    <div className="w-full bg-white">
      <nav
        className={cn(
          "flex max-w-[1080px] gap-2 mx-auto items-center w-full py-2 px-4 xl:px-0 justify-between overflow-visible",
          className
        )}
      >
        {/* Logo and Brand Name */}
        <div className="flex items-center gap-2">
          <div>
            <SideMenu
              //     user={{
              //       name: "John Doe",
              //       email: "john.doe@example.com",
              //       avatar: "https://via.placeholder.com/150",
              //       isVerified: true,
              //     }}
              trigger={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  iconPosition="center"
                  className="bg-[#F2F4F7] rounded-full size-8 border-[#E7E7E7] hover:bg-transparent md:hidden"
                  icon={
                    <Image
                      src={ICONS.ui.hamburger}
                      width={18}
                      height={18}
                      alt="Hamburger Menu"
                    />
                  }
                />
              }
              isLoggedIn={false}
            />
          </div>
          <div>
            <Link href="/" className="flex items-center">
              <Image
                src={ICONS.logo.main}
                alt="BuyOrSell Logo"
                width={156}
                height={49}
              />
            </Link>
          </div>
        </div>

        {/* Center Section - Location and Search */}
        <div className="flex items-start gap-2 md:flex-1">
          {/* Location Selector */}
          <Button
            variant="ghost"
            size="icon"
            icon={<Bell className="size-5 mx-1" />}
            iconPosition="center"
            className="md:hidden"
          />
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  icon={<ChevronDown className="-ml-3" />}
                  iconPosition="right"
                  className="py-2 text-xs text-secondary-40 hover:text-purple transition-colors whitespace-nowrap border-0 px-0 shadow-none data-[state=open]:text-purple focus:outline-none focus:ring-0 hover:bg-transparent"
                >
                  {city || "UAE"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-fit text-xs" align="start">
                <DropdownMenuItem onClick={() => setCity("")}>
                  All Cities (UAE)
                </DropdownMenuItem>
                {/* {emirates?.data?.map((cityName) => (
                  <DropdownMenuItem
                    key={cityName}
                    onClick={() => setCity(cityName)}
                  >
                    {cityName}
                  </DropdownMenuItem>
                ))} */}
                <DropdownMenuItem key={"UAE"} onClick={() => setCity("UAE")}>
                  UAE
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="hidden md:flex flex-1">
            <SearchAnimated />
          </div>
        </div>

        {/* Right Section - Action Buttons */}
        <div className="hidden md:flex items-center gap-5 ml-2">
          {/* Log In / Sign Up Button */}
          <Link href="/login" className="text-xs font-medium text-purple">
            Log In / Sign Up
          </Link>

          {/* Place Ad Button */}

          <Button
            variant="filled"
            size="icon-sm"
            iconPosition="right"
            onClick={() => setIsPostAdDialogOpen(true)}
            icon={
              <Image
                src={ICONS.ai.aiPurpleBg}
                alt="AI Logo"
                width={24}
                height={24}
              />
            }
            className="px-4 text-xs font-medium text-white h-10"
          >
            <span className="hidden lg:block">Place Ad Free with</span>
            <span className="block lg:hidden">Place Ad</span>
          </Button>
        </div>
      </nav>

      {/* Post Ad Dialog */}
      <PostAdDialog
        isOpen={isPostAdDialogOpen}
        onClose={() => setIsPostAdDialogOpen(false)}
      />
    </div>
  );
};

export default Navbar;
