"use client";

import { Organization } from "@/interfaces/organization.types";
import { Button } from "@/components/ui/button";
import { ExternalLink, Plus } from "lucide-react";
import { FollowOrganizationButton } from "../../../jobs/_components/follow-organization-button";
import { EmployerProfile } from "@/interfaces/job.types";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "nextjs-toploader/app";
import Image from "next/image";
import { ICONS } from "@/constants/icons";
import { H2, Typography } from "@/components/typography";
import { ChatInit } from "@/components/global/chat-init";

interface OrganizationHeaderProps {
  organization: Organization & Partial<EmployerProfile>;
}

export const OrganizationHeader = ({ organization }: OrganizationHeaderProps) => {
  const session = useAuthStore((state) => state.session);
  const isOwner = session?.user?._id === organization?.owner?._id;
  const router = useRouter()
  return (
    <div>
      <H2 className="font-bold text-slate-900 dark:text-gray-100 mb-2">
        {organization.tradeName || organization.legalName}
        {organization.verified && (
          <Image src={ICONS.auth.verified} width={20} height={20} alt="verified" className="inline-block ml-2" />
        )}
      </H2>
      <Typography variant="body-small" className="text-slate-600 dark:text-gray-400 mb-4">
        {organization.type || "Dubai's Leading Classifieds Platform"}
      </Typography>

      {/* Meta info */}
      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-gray-400 mb-6 flex-wrap">
        <span>{organization.industry || "Technology, Information And Internet"}</span>
        <span>•</span>
        <button className="text-purple-600 dark:text-purple-400 hover:underline">
          {organization.followersCount || "116K"} Followers
        </button>
        <span>•</span>
        <span>{organization.companySize || "501-1K Employees"}</span>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4 mb-8">
        {isOwner ? <Button
          className="flex items-center gap-2"
          iconPosition="center"
          icon={
            <Plus size={18} />
          }
          size={"default"}
          onClick={() => router.push(`/organizations/edit/${organization._id}`)}
        >
          Edit Organization
        </Button> : <FollowOrganizationButton
          organizationId={organization._id}
          initialIsFollowing={organization.isFollowing}
          className="h-10 px-12 text-sm flex items-center gap-2 w-auto"
        />}

        {!isOwner && (
          <ChatInit
            type="organisation"
            organisationId={organization._id}
            sellerId={organization.owner?._id}
            sellerName={organization.tradeName || organization.legalName}
            sellerImage={organization.logoUrl}
            className="h-10 text-sm flex items-center gap-2 w-auto"
            variant="outline"
            size="default"
            showLabel={true}
            label="Message"
            iconSize={18}
          />
        )}

        {organization.website && (
          <Button
            variant="outline"
            className="h-10 text-sm flex items-center gap-2 w-auto"
            iconPosition="center"
            onClick={() => window.open(organization.website, "_blank")}
            icon={
              <ExternalLink size={18} />
            }
          >
            View Website
          </Button>
        )}
      </div>
    </div>
  );
};
