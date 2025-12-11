"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/typography";

const NotificationSettingsPage = () => {
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
    // Here you would typically make an API call to save the settings
    alert("Notification settings saved successfully!");
  };

  return (
    <div className="w-full">
      {/* Mobile Header */}
      <div className="flex justify-center sm:hidden border sticky top-0 bg-white z-10 py-4 shadow-sm">
        <Button
          variant="ghost"
          icon={<ChevronLeft className="h-4 w-4 -mr-2" />}
          iconPosition="center"
          size="icon-sm"
          className="absolute left-4 text-purple"
          onClick={() => window.history.back()}
        />
        <Typography variant="lg-semibold" className="text-dark-blue">
          Notification Settings
        </Typography>
      </div>

      <div className="sm:px-4 xl:px-0 flex flex-col gap-5 sm:py-8">
        {/* Desktop Breadcrumbs */}
        <div className="hidden sm:flex items-center gap-2">
          <Link
            href="/user/profile"
            className="text-gray-400 font-semibold text-sm hover:text-purple"
          >
            My Profile
          </Link>
          <ChevronsRight className="size-6 text-purple" />
          <Link
            href="/user/profile/settings"
            className="text-gray-400 font-semibold text-sm hover:text-purple"
          >
            Settings
          </Link>
          <ChevronsRight className="size-6 text-purple" />
          <span className="text-purple-600 font-semibold text-sm">
            Notification Settings
          </span>
        </div>

        {/* Settings Card */}
        <div className="sm:bg-white sm:rounded-2xl border-0 sm:border border-gray-200 sm:shadow-sm max-w-2xl w-full mx-auto">
          {/* Header */}
          <div className="hidden sm:block text-center py-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Notification Settings
            </h2>
          </div>

          <div className="border-t border-gray-200">
            {/* Push Notifications */}
            <div className="flex items-center justify-between py-4 px-6">
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  Push Notifications
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Enable Or Disable All
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

            {/* Marketing Emails */}
            <div className="flex items-center justify-between py-4 px-6">
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  Marketing Emails
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Tips, features, and product updates
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

            {/* SMS Notifications */}
            <div className="flex items-center justify-between py-4 px-6">
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  SMS Notifications
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Important alerts via text message
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

          {/* Save Button */}
          <div className="p-6">
            <Button
              onClick={handleSave}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-base font-medium"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettingsPage;
