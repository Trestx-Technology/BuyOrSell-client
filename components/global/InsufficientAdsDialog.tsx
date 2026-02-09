"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
      ResponsiveModal,
      ResponsiveModalContent,
      ResponsiveModalDescription,
      ResponsiveModalHeader,
      ResponsiveModalTitle,
      ResponsiveModalFooter,
} from "@/components/ui/responsive-modal";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowRight } from "lucide-react";
import { useLocale } from "@/hooks/useLocale";

interface InsufficientAdsDialogProps {
      isOpen: boolean;
      onClose: () => void;
      type?: "normal" | "featured";
}

export const InsufficientAdsDialog: React.FC<InsufficientAdsDialogProps> = ({
      isOpen,
      onClose,
      type = "normal",
}) => {
      const router = useRouter();
      const { locale, t } = useLocale();

      // Determine title and description based on type
      const title = type === "featured" ? "Out of Featured Ads" : "Out of Ads";
      const description =
            type === "featured"
                  ? "You have used all your available featured ads for this category. Upgrade your plan or buy an add-on to keep highlighting your listings."
                  : "Your subscription does not have enough available ads for this category to post this. Please upgrade your plan or purchase additional ads.";

      return (
            <ResponsiveModal open={isOpen} onOpenChange={onClose}>
                  <ResponsiveModalContent className="sm:max-w-md bg-white rounded-2xl">
                        <ResponsiveModalHeader>
                              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 mb-6 mt-4 sm:mt-0">
                                    <AlertCircle className="h-8 w-8 text-red-500" />
                              </div>
                              <ResponsiveModalTitle className="text-center text-2xl font-bold text-gray-900">
                                    {title}
                              </ResponsiveModalTitle>
                              <ResponsiveModalDescription className="text-center text-gray-500 mt-3 text-base leading-relaxed">
                                    {description}
                              </ResponsiveModalDescription>
                        </ResponsiveModalHeader>
                        <ResponsiveModalFooter className="mt-8 flex flex-col gap-3 pb-6 sm:pb-0">
                              <Button
                                    className="w-full rounded-xl h-10 text-base font-semibold transition-all flex gap-3 items-center justify-center group"
                                    onClick={() => {
                                          onClose();
                                          router.push(`/${locale}/plans`);
                                    }}
                                    icon={
                                          <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />

                                    }
                                    iconPosition="center"
                                    size={"small"}
                              >
                                    Check Plans
                              </Button>
                              <Button
                                    variant="dangerOutlined"
                                    className="w-full h-10 font-medium"
                                    onClick={onClose}
                                    size={"small"}
                              >
                                    Maybe Later
                              </Button>
                        </ResponsiveModalFooter>
                  </ResponsiveModalContent>
            </ResponsiveModal>
      );
};
