"use client";

import { useTheme } from "next-themes";
import { useState } from "react";
import { useRouter } from "nextjs-toploader/app";
import {
  Bell,
  Lock,
  FileText,
  UserX,
  Moon,
  Trash2,
  LogOut,
  ChevronRight,
  User,
  MapPin,
} from "lucide-react";
import { useLocale } from "@/hooks/useLocale";
import { WarningConfirmationDialog } from "@/components/ui/warning-confirmation-dialog";
import { logout as LogoutAPI } from "@/app/api/auth/auth.services";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";

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
        className={`flex items-center justify-between py-4 px-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${danger ? "hover:bg-red-50 dark:hover:bg-red-900/10" : ""
        }`}
        onClick={onClick}
      >
        <div className="flex items-center gap-4">
          <div
            className={`p-2 rounded-lg ${
              danger ? "bg-red-100 dark:bg-red-900/20" : "bg-gray-100 dark:bg-gray-800"
            }`}
          >
            <div className={danger ? "text-red-600 dark:text-red-400" : "text-gray-700 dark:text-gray-300"}>
              {icon}
            </div>
          </div>
          <div>
            <h3
              className={`text-sm font-medium ${
                danger ? "text-red-900 dark:text-red-300" : "text-gray-900 dark:text-white"
              }`}
            >
              {title}
            </h3>
            <p
              className={`text-xs ${
                danger ? "text-red-600 dark:text-red-400" : "text-gray-500 dark:text-gray-400"
              } leading-relaxed`}
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
      <div className="border-b border-gray-200 dark:border-gray-800 mx-6" />
    </>
  );
}


export default function SettingsCard() {
  const router = useRouter();
  const { t, localePath } = useLocale();
  const { clearSession } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const [showDeleteAccountDialog, setShowDeleteAccountDialog] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleMyProfile = () => {
    router.push(localePath("/user/profile"));
  };

  const handleAddress = () => {
    router.push(localePath("/user/address"));
  };

  const handleNotificationSettings = () => {
    router.push(localePath("/user/profile/settings/notification-settings"));
  };

  const handleChangePassword = () => {
    router.push(localePath("/user/profile/settings/change-password"));
  };

  const handleAccountReports = () => {
    console.log("Navigate to account reports");
  };

  const handleBlockedUsers = () => {
    router.push(localePath("/user/profile/settings/blocked-users"));
  };

  const handleDeleteAccount = () => {
    setShowDeleteAccountDialog(true);
  };

  const handleConfirmDeleteAccount = async () => {
    setIsDeletingAccount(true);
    try {
      // TODO: Implement delete account API call
      console.log("Delete account");
      // await deleteAccountAPI();
      toast.success("Account deleted successfully");
      // Redirect to home or login page after deletion
      router.push("/");
    } catch (error) {
      console.error("Error deleting account:", error);
    } finally {
      setIsDeletingAccount(false);
      setShowDeleteAccountDialog(false);
    }
  };

  const handleLogout = () => {
    setShowLogoutDialog(true);
  };

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      await LogoutAPI();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      await clearSession();
      toast.success("Logged out successfully");
      router.push("/");
      router.refresh();
      setIsLoggingOut(false);
      setShowLogoutDialog(false);
    }
  };

  return (
    <div className="sm:bg-white sm:dark:bg-gray-900 sm:rounded-2xl border-0 sm:border border-gray-200 sm:dark:border-gray-800 sm:shadow-sm max-w-2xl w-full mx-auto">
      <div className="hidden sm:block text-center py-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {t.user.settings.settings}
        </h2>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-800">
        <SettingsItem
          icon={<User className="w-5 h-5" />}
          title={t.user.profile.myProfile}
          description={t.user.settings.profileDescription}
          onClick={handleMyProfile}
        />

        <SettingsItem
          icon={<MapPin className="w-5 h-5" />}
          title={t.user.address.myAddress}
          description={t.user.settings.addressDescription}
          onClick={handleAddress}
        />

        <SettingsItem
          icon={<Bell className="w-5 h-5" />}
          title={t.user.settings.notificationSettings}
          description="Manage notification preferences"
          onClick={handleNotificationSettings}
        />

        <SettingsItem
          icon={<Lock className="w-5 h-5" />}
          title={t.user.settings.changePassword}
          description="Update your account password"
          onClick={handleChangePassword}
        />

        <SettingsItem
          icon={<FileText className="w-5 h-5" />}
          title="Account Reports"
          description="View your account activity reports"
          onClick={handleAccountReports}
        />

        <SettingsItem
          icon={<UserX className="w-5 h-5" />}
          title={t.user.settings.blockedUsers}
          description="Manage blocked users list"
          onClick={handleBlockedUsers}
        />

        <div className="flex items-center justify-between py-4 px-6">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
              <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Dark Mode</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Toggle dark mode theme
              </p>
            </div>
          </div>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              theme === "dark" ? "bg-purple-600" : "bg-gray-200 dark:bg-gray-700"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                theme === "dark" ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
        <div className="border-b border-gray-200 dark:border-gray-800 mx-6" />

        <SettingsItem
          icon={<Trash2 className="w-5 h-5" />}
          title="Delete Account"
          description="Permanently delete your account"
          onClick={handleDeleteAccount}
          danger={true}
        />

        <SettingsItem
          icon={<LogOut className="w-5 h-5" />}
          title="Logout"
          description="Sign out of your account"
          onClick={handleLogout}
          danger={true}
        />
      </div>

      <WarningConfirmationDialog
        open={showDeleteAccountDialog}
        onOpenChange={setShowDeleteAccountDialog}
        title="Delete Account"
        description="Are you sure you want to delete your account? This action cannot be undone. All your data will be permanently removed."
        confirmText="Delete Account"
        cancelText="Cancel"
        onConfirm={handleConfirmDeleteAccount}
        isLoading={isDeletingAccount}
        confirmVariant="danger"
      />

      <WarningConfirmationDialog
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
        title="Sign Out"
        description="Are you sure you want to sign out of your account?"
        confirmText="Sign Out"
        cancelText="Cancel"
        onConfirm={handleConfirmLogout}
        isLoading={isLoggingOut}
        confirmVariant="primary"
      />
    </div>
  );
}
