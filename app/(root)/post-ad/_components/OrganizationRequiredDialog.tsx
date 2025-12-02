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

interface OrganizationRequiredDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OrganizationRequiredDialog({
  isOpen,
  onClose,
}: OrganizationRequiredDialogProps) {
  const router = useRouter();

  const handleCreateOrganization = () => {
    onClose();
    router.push("/organizations/new");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Organization Required</DialogTitle>
          <DialogDescription className="pt-2">
            To proceed with posting a job, you need to create an organization
            first. Jobs can only be posted by organizations, not as an
            individual.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCreateOrganization}>
            Create Organization
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

