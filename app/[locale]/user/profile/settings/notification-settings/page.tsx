"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/typography";
import { useLocale } from "@/hooks/useLocale";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const NotificationSettingsPage = () => {
  const { t, localePath } = useLocale();
  const router = useRouter();
  const [notifications, setNotifications] = useState({
    push: true,
    marketing: false,
    sms: true,
  });

  const handleToggle = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    console.log("Saving notification settings:", notifications);
    toast.success(t.user.notificationSettings.settingsSaved);
  };

  return (
    <div className="w-full">
      <div className="flex justify-center sm:hidden border sticky top-0 bg-white z-10 py-4 shadow-sm">
        <Button
          variant="ghost"
          icon={<ChevronLeft className="h-4 w-4 -mr-2" />}
          iconPosition="center"
          size="icon-sm"
          className="absolute left-4 text-purple"
          onClick={() => router.back()}
        />
        <Typography variant="lg-semibold" className="text-dark-blue">
          {t.user.notificationSettings.pageTitle}
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
            className="text-gray-400 font-semibold text-sm hover:text-purple"
          >
            {t.user.settings.settings}
          </Link>
          <ChevronsRight className="size-6 text-purple" />
          <span className="text-purple-600 font-semibold text-sm">
            {t.user.notificationSettings.notificationSettings}
          </span>
        </div>

        <div className="sm:bg-white sm:rounded-2xl border-0 sm:border border-gray-200 sm:shadow-sm max-w-2xl w-full mx-auto">
          <div className="hidden sm:block text-center py-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {t.user.notificationSettings.notificationSettings}
            </h2>
          </div>

          <div className="border-t border-gray-200">
            <div className="flex items-center justify-between py-4 px-6">
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  {t.user.notificationSettings.pushNotifications}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {t.user.notificationSettings.enableOrDisableAll}
                </p>
              </div>
              <button
                onClick={() => handleToggle("push")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.push ? "bg-purple-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.push ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            <div className="border-b border-gray-200 mx-6" />

            <div className="flex items-center justify-between py-4 px-6">
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  {t.user.notificationSettings.marketingEmails}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {t.user.notificationSettings.marketingEmailsDescription}
                </p>
              </div>
              <button
                onClick={() => handleToggle("marketing")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.marketing ? "bg-purple-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.marketing ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            <div className="border-b border-gray-200 mx-6" />

            <div className="flex items-center justify-between py-4 px-6">
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  {t.user.notificationSettings.smsNotifications}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {t.user.notificationSettings.smsNotificationsDescription}
                </p>
              </div>
              <button
                onClick={() => handleToggle("sms")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.sms ? "bg-purple-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.sms ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="p-6">
            <Button
              onClick={handleSave}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-base font-medium"
            >
              {t.user.notificationSettings.saveChanges}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettingsPage;

