"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useLocale } from "@/hooks/useLocale";

interface OrganizationRequiredDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OrganizationRequiredDialog({
  isOpen,
  onClose,
}: OrganizationRequiredDialogProps) {
  const router = useRouter();
  const { localePath, t } = useLocale();

  const handleCreateOrganization = () => {
    onClose();
    router.push(localePath("/organizations/new"));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t.organizations.dialog.organizationRequired}</DialogTitle>
          <DialogDescription className="pt-2">
            {t.organizations.dialog.organizationRequiredDescription}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            {t.organizations.form.cancel}
          </Button>
          <Button variant="primary" onClick={handleCreateOrganization}>
            {t.organizations.form.createOrganization}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

