"use client";

import React from "react";
import { ChevronLeft } from "lucide-react";
import SettingsCard from "../../_components/settings-card";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { useLocale } from "@/hooks/useLocale";
import { useRouter } from "next/navigation";
import { Container1080 } from "@/components/layouts/container-1080";
import { MobileStickyHeader } from "@/components/global/mobile-sticky-header";

const SettingsPage = () => {
  const { t, localePath } = useLocale();
  const router = useRouter();

  return (
    <Container1080>
      <MobileStickyHeader title={t.user.settings.pageTitle} />
      <div className="px-4 py-8 space-y-6">
        <Breadcrumbs
          items={[
            {
              id: "profile",
              label: t.user.profile.myProfile,
              href: localePath("/user/profile"),
            },
            {
              id: "settings",
              label: t.user.settings.settings,
              isActive: true,
            },
          ]}
          showSelectCategoryLink={false}
          className="text-sm"
        />
        <SettingsCard />
      </div>
    </Container1080>
  );
};

export default SettingsPage;
