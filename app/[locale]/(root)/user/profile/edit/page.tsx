"use client";

import React from "react";
import ProfileEditForm from "../../_components/profile-edit-form";
import Link from "next/link";
import { ChevronLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/typography";
import { useLocale } from "@/hooks/useLocale";
import { useRouter } from "next/navigation";
import { Container1080 } from "@/components/layouts/container-1080";
import { MobileStickyHeader } from "@/components/global/mobile-sticky-header";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

const ProfileEditPage = () => {
  const { t, localePath } = useLocale();

  return (
    <Container1080>
      <MobileStickyHeader title={t.user.profileEdit.pageTitle} />

      <div className="px-4 py-8 space-y-6">
        <Breadcrumbs
          items={[
            {
              id: "profile",
              label: t.user.profile.myProfile,
              href: localePath("/user/profile"),
            },
            {
              id: "edit-profile",
              label: t.user.profileEdit.editProfile,
              href: localePath("/user/profile/edit"),
            },
          ]}
          showSelectCategoryLink={false}
          showEllipsis={true}
          maxItems={3}
          variant="minimal"
          className="text-sm"
        />

        <ProfileEditForm />
      </div>
    </Container1080>
  );
};

export default ProfileEditPage;
