"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronsRight } from "lucide-react";
import SettingsCard from "../../_components/settings-card";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/hooks/useLocale";
import { useRouter } from "next/navigation";
import { Container1080 } from "@/components/layouts/container-1080";

const SettingsPage = () => {
  const { t, localePath } = useLocale();
  const router = useRouter();

  return (
    <Container1080>
      <div className="flex justify-center sm:hidden border sticky top-0 bg-white z-10 py-4 shadow-sm">
        <Button
          variant={"ghost"}
          icon={<ChevronLeft className="h-4 w-4 -mr-2" />}
          iconPosition="center"
          size={"icon-sm"}
          className="absolute left-4 text-purple"
          onClick={() => router.back()}
        />
        <Typography variant="lg-semibold" className="text-dark-blue">
          {t.user.settings.pageTitle}
        </Typography>
      </div>
      <div className="sm:px-4 xl:px-0 flex flex-col gap-5 sm:py-8">
        <div className="hidden sm:flex items-center gap-2">
          <Link
            href={localePath("/user/profile")}
            className="text-gray-400 font-semibold text-sm hover:text-purple"
          >
            {t.user.profile.myProfile}
          </Link>
          <ChevronsRight className="size-6 text-purple" />
          <Link
            href={localePath("/user/profile/settings")}
            className="text-purple-600 font-semibold text-sm"
          >
            {t.user.settings.settings}
          </Link>
        </div>
        <SettingsCard />
      </div>
    </Container1080>
  );
};

export default SettingsPage;
