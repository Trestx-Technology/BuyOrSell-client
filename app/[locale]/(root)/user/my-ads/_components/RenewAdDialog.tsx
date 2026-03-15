"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ResponsiveDialogDrawer } from "@/components/ui/responsive-dialog-drawer";

interface RenewAdDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  renewDays: number;
  onRenewDaysChange: (days: number) => void;
  onConfirm: () => void;
  isRenewing: boolean;
}

export const RenewAdDialog: React.FC<RenewAdDialogProps> = ({
  open,
  onOpenChange,
  renewDays,
  onRenewDaysChange,
  onConfirm,
  isRenewing,
}) => {
  return (
    <ResponsiveDialogDrawer
      open={open}
      onOpenChange={onOpenChange}
      title="Renew Ad"
      description="Choose how long you want to extend your ad's validity."
    >
      <div className="grid gap-4 py-4 px-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="days" className="text-right">
            Duration
          </Label>
          <div className="col-span-3">
            <Select
              value={String(renewDays)}
              onValueChange={(val) => onRenewDaysChange(Number(val))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent className="z-[9999]">
                <SelectItem value="30">30 Days</SelectItem>
                <SelectItem value="60">60 Days</SelectItem>
                <SelectItem value="90">90 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isRenewing}
          >
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={isRenewing}>
            {isRenewing ? "Renewing..." : "Confirm Renewal"}
          </Button>
        </div>
      </div>
    </ResponsiveDialogDrawer>
  );
};
