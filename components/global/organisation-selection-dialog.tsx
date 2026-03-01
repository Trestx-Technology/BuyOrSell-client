"use client";

import { useMyOrganization } from "@/hooks/useOrganizations";
import {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
  ResponsiveModalDescription,
} from "@/components/ui/responsive-modal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Organization } from "@/interfaces/organization.types";
import { Building2 } from "lucide-react";

interface OrganisationSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (organisation: Organization) => void;
  title?: string;
  description?: string;
}

export function OrganisationSelectionDialog({
  open,
  onOpenChange,
  onSelect,
  title = "Select Organisation",
  description = "Choose which organisation you want to use for this action.",
}: OrganisationSelectionDialogProps) {
  const { data: orgData, isLoading } = useMyOrganization(open);
  const organisations = orgData?.data || [];

  return (
    <ResponsiveModal open={open} onOpenChange={onOpenChange}>
      <ResponsiveModalContent className="sm:max-w-[425px]">
        <ResponsiveModalHeader>
          <ResponsiveModalTitle>{title}</ResponsiveModalTitle>
          <ResponsiveModalDescription>{description}</ResponsiveModalDescription>
        </ResponsiveModalHeader>

        <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-lg border"
              >
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[150px]" />
                  <Skeleton className="h-3 w-[100px]" />
                </div>
              </div>
            ))
          ) : organisations.length > 0 ? (
            organisations.map((org) => (
              <button
                key={org._id}
                onClick={() => {
                  onSelect(org);
                  onOpenChange(false);
                }}
                className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors text-left group"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={org.logoUrl} alt={org.tradeName} />
                  <AvatarFallback>
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate text-primary group-hover:text-purple transition-colors">
                    {org.tradeName || org.legalName}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {org.type} • {org.emirate}
                  </p>
                </div>
              </button>
            ))
          ) : (
            <div className="py-8 text-center bg-muted/50 rounded-lg border border-dashed">
              <Building2 className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
              <p className="text-sm text-muted-foreground">
                No organisations found
              </p>
            </div>
          )}
        </div>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
}
