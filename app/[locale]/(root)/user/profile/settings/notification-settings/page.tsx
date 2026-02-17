"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/typography";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { useLocale } from "@/hooks/useLocale";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Container1080 } from "@/components/layouts/container-1080";
import { useGetProfile } from "@/hooks/useUsers";
import {
  useGetUserSettings,
  useCreateUserSettings,
  useUpdateUserSettings,
} from "@/hooks/useUserSettings";
import { cn } from "@/lib/utils";
import { MobileStickyHeader } from "@/components/global/mobile-sticky-header";

interface NotificationItem {
  key: "push" | "marketing" | "sms";
  title: string;
  description: string;
  enabled: boolean;
}

const NotificationSettingsPage = () => {
  const { t, localePath, locale } = useLocale();
  const router = useRouter();
  const { data: profileData } = useGetProfile();
  const userId = profileData?.data?.user?._id;

  const { data: userSettingsData, isLoading: isLoadingSettings } =
    useGetUserSettings();

  const createUserSettingsMutation = useCreateUserSettings();
  const updateUserSettingsMutation = useUpdateUserSettings();

  const [notifications, setNotifications] = useState({
    push: true,
    marketing: false,
    sms: true,
  });

  // Notification items configuration
  const notificationItems: NotificationItem[] = [
    {
      key: "push",
      title: t.user.notificationSettings.pushNotifications,
      description: t.user.notificationSettings.enableOrDisableAll,
      enabled: true,
    },
    {
      key: "marketing",
      title: t.user.notificationSettings.marketingEmails,
      description: t.user.notificationSettings.marketingEmailsDescription,
      enabled: false,
    },
    {
      key: "sms",
      title: t.user.notificationSettings.smsNotifications,
      description: t.user.notificationSettings.smsNotificationsDescription,
      enabled: false,
    },
  ];

  // Initialize notifications from user settings
  useEffect(() => {
    if (userSettingsData?.data) {
      const settings = userSettingsData.data;
      // Map notificationsEnabled to push notifications
      // You can extend this to store individual preferences if needed
      setNotifications({
        push: settings.notificationsEnabled ?? true,
        marketing: false, // Can be extended if API supports it
        sms: false, // Can be extended if API supports it
      });
    }
  }, [userSettingsData]);

  const handleToggle = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = async () => {
    if (!userId) {
      toast.error("User ID not found");
      return;
    }

    // Extract language code from locale (e.g., "en" from "en-US")
    const languageCode = locale?.split("-")[0] || "en";

    const payload = {
      userId,
      language: languageCode,
      notificationsEnabled: notifications.push, // Using push as the main notification flag
      darkMode: false, // Can be extended if needed
    };

    try {
      // Check if settings exist
      if (userSettingsData?.data) {
        // Update existing settings
        await updateUserSettingsMutation.mutateAsync(payload);
      } else {
        // Create new settings
        await createUserSettingsMutation.mutateAsync(payload);
      }
      toast.success(t.user.notificationSettings.settingsSaved);
    } catch (error) {
      // Error toast is handled by axios interceptor
      console.error("Failed to save notification settings:", error);
    }
  };

  const isLoading =
    isLoadingSettings ||
    createUserSettingsMutation.isPending ||
    updateUserSettingsMutation.isPending;

  return (
    <Container1080>
      <MobileStickyHeader title={t.user.notificationSettings.pageTitle} />

      <div className="py-8 space-y-6">
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
              href: localePath("/user/profile/settings"),
            },
            {
              id: "notification-settings",
              label: t.user.notificationSettings.notificationSettings,
              isActive: true,
            },
          ]}
          showSelectCategoryLink={false}
          showEllipsis={true}
          maxItems={3}
          variant="minimal"
          showHomeIcon={false}
          className="text-sm px-4"
        />

        <div className="sm:bg-white dark:bg-gray-900 sm:rounded-2xl border-0 sm:border border-gray-200 dark:border-gray-800 sm:shadow-sm max-w-2xl w-full mx-auto">
          <div className="hidden sm:block text-center py-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t.user.notificationSettings.notificationSettings}
            </h2>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-800">
            {notificationItems.map((item, index) => (
              <React.Fragment key={item.key}>
                <div
                  className={cn(
                    "flex items-center justify-between py-4 px-6",
                    item.enabled ? "opacity-100" : "opacity-50"
                  )}
                >
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle(item.key)}
                    disabled={item.enabled}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notifications[item.key] ? "bg-purple-600" : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notifications[item.key]
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
                {index < notificationItems.length - 1 && (
                  <div className="border-b border-gray-200 dark:border-gray-800 mx-6" />
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="p-6">
            <Button
              onClick={handleSave}
              isLoading={isLoading}
              disabled={isLoading || !userId}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-base font-medium"
            >
              {isLoading
                ? t.common.loading
                : t.user.notificationSettings.saveChanges}
            </Button>
          </div>
        </div>
      </div>
    </Container1080>
  );
};

export default NotificationSettingsPage;
