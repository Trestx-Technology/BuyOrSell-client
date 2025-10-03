"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Lock,
  FileText,
  UserX,
  Moon,
  Trash2,
  LogOut,
  ChevronRight,
} from "lucide-react";

interface SettingsItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick?: () => void;
  rightElement?: React.ReactNode;
  danger?: boolean;
}

function SettingsItem({
  icon,
  title,
  description,
  onClick,
  rightElement,
  danger = false,
}: SettingsItemProps) {
  return (
    <>
      <div
        className={`flex items-center justify-between py-4 px-6 cursor-pointer hover:bg-gray-50 transition-colors ${
          danger ? "hover:bg-red-50" : ""
        }`}
        onClick={onClick}
      >
        <div className="flex items-center gap-4">
          <div
            className={`p-2 rounded-lg ${danger ? "bg-red-100" : "bg-gray-100"}`}
          >
            <div className={danger ? "text-red-600" : "text-gray-600"}>
              {icon}
            </div>
          </div>
          <div>
            <h3
              className={`text-sm font-medium ${danger ? "text-red-900" : "text-gray-900"}`}
            >
              {title}
            </h3>
            <p
              className={`text-xs ${danger ? "text-red-600" : "text-gray-500"} leading-relaxed`}
            >
              {description}
            </p>
          </div>
        </div>
        {rightElement || (
          <ChevronRight
            className={`w-4 h-4 ${danger ? "text-red-400" : "text-gray-400"}`}
          />
        )}
      </div>
      <div className="border-b border-gray-200 mx-6" />
    </>
  );
}

export default function SettingsCard() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);

  const handleNotificationSettings = () => {
    router.push("/user/profile/settings/notification-settings");
  };

  const handleChangePassword = () => {
    router.push("/user/profile/settings/change-password");
  };

  const handleAccountReports = () => {
    console.log("Navigate to account reports");
  };

  const handleBlockedUsers = () => {
    router.push("/user/profile/settings/blocked-users");
  };

  const handleDeleteAccount = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (confirmed) {
      console.log("Delete account");
    }
  };

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to sign out?");
    if (confirmed) {
      console.log("Logout");
    }
  };

  return (
    <div className="sm:bg-white sm:rounded-2xl border-0 sm:border border-gray-200 sm:shadow-sm max-w-2xl w-full mx-auto">
      {/* Header */}
      <div className="hidden sm:block text-center py-6">
        <h2 className="text-xl font-semibold text-gray-900">Settings</h2>
      </div>

      <div className="border-t border-gray-200">
        {/* Notification Settings */}
        <SettingsItem
          icon={<Bell className="w-5 h-5" />}
          title="Change Notification Settings"
          description="Manage notification preferences"
          onClick={handleNotificationSettings}
        />

        {/* Change Password */}
        <SettingsItem
          icon={<Lock className="w-5 h-5" />}
          title="Change Password"
          description="Update your account password"
          onClick={handleChangePassword}
        />

        {/* Account Reports */}
        <SettingsItem
          icon={<FileText className="w-5 h-5" />}
          title="Account Reports"
          description="View your account activity reports"
          onClick={handleAccountReports}
        />

        {/* Blocked Users */}
        <SettingsItem
          icon={<UserX className="w-5 h-5" />}
          title="Blocked Users"
          description="Manage blocked users list"
          onClick={handleBlockedUsers}
        />

        {/* Dark Mode Toggle */}
        <div className="flex items-center justify-between py-4 px-6">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-gray-100">
              <Moon className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900">Dark Mode</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Toggle dark mode theme
              </p>
            </div>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              darkMode ? "bg-purple-600" : "bg-gray-200"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                darkMode ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
        <div className="border-b border-gray-200 mx-6" />

        {/* Delete Account */}
        <SettingsItem
          icon={<Trash2 className="w-5 h-5" />}
          title="Delete Account"
          description="Permanently delete your account"
          onClick={handleDeleteAccount}
          danger={true}
        />

        {/* Logout */}
        <SettingsItem
          icon={<LogOut className="w-5 h-5" />}
          title="Logout"
          description="Sign out of your account"
          onClick={handleLogout}
          danger={true}
        />
      </div>
    </div>
  );
}
