"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronsRight } from "lucide-react";
import SettingsCard from "../../_components/settings-card";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";

const SettingsPage = () => {
  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className="flex justify-center sm:hidden border sticky top-0 bg-white z-10 py-4 shadow-sm">
        <Button
          variant={"ghost"}
          icon={<ChevronLeft className="h-4 w-4 -mr-2" />}
          iconPosition="center"
          size={"icon-sm"}
          className="absolute left-4 text-purple"
        />
        <Typography variant="lg-semibold" className="text-dark-blue">
          Settings
        </Typography>
      </div>
      <div className="sm:px-4 xl:px-0 flex flex-col gap-5 sm:py-8">
        <div className="hidden sm:flex items-center gap-2">
          <Link
            href={"/user/profile"}
            className="text-gray-400 font-semibold text-sm hover:text-purple"
          >
            My Profile
          </Link>
          <ChevronsRight className="size-6 text-purple" />
          <Link
            href={"/user/profile/settings"}
            className="text-purple-600 font-semibold text-sm"
          >
            Settings
          </Link>
        </div>
        {/* Settings Card */}
        <SettingsCard />
      </div>
    </div>
  );
};

export default SettingsPage;
