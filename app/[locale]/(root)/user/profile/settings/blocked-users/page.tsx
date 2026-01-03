"use client";

import React, { useState, useMemo, useEffect } from "react";
import { ChevronLeft, Search, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/typography";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { useLocale } from "@/hooks/useLocale";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Container1080 } from "@/components/layouts/container-1080";
import { useGetBlockedUsers, useUnblockUser } from "@/hooks/useUserBlock";
import { formatDate } from "@/utils/format-date";
import type { BlockedUser } from "@/interfaces/user-block.types";
import { WarningConfirmationDialog } from "@/components/ui/warning-confirmation-dialog";
import { Input } from "@/components/ui/input";
import { BlockedUserItem } from "./_components/blocked-user-item";
import { MobileStickyHeader } from "@/components/global/mobile-sticky-header";

// TODO: search pagination using api
interface DisplayBlockedUser {
  id: string; // Block record _id (used for unblocking)
  name: string;
  email: string;
  company?: string;
  reason: string;
  blockedDate: string;
}

const BlockedUsersPage = () => {
  const { t, localePath } = useLocale();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [showUnblockDialog, setShowUnblockDialog] = useState(false);
  const [showUnblockSelectedDialog, setShowUnblockSelectedDialog] =
    useState(false);
  const [userToUnblock, setUserToUnblock] = useState<string | null>(null);
  const {
    data: blockedUsersData,
    isLoading: isLoadingBlockedUsers,
    error: blockedUsersError,
  } = useGetBlockedUsers();
  const unblockUserMutation = useUnblockUser();

  // Transform API data to display format
  const blockedUsers: DisplayBlockedUser[] = useMemo(() => {
    if (!blockedUsersData?.data) return [];

    return blockedUsersData.data.map((blockRecord: BlockedUser) => {
      const blockedUser = blockRecord.blocked;
      const name =
        blockedUser.firstName && blockedUser.lastName
          ? `${blockedUser.firstName} ${blockedUser.lastName}`
          : blockedUser.name || blockedUser.email || "Unknown User";
      const email = blockedUser.email || "";
      const company = ""; // Company info not available in API response
      const reason = blockRecord.reason || "No reason provided";
      const blockedDate = blockRecord.createdAt
        ? formatDate(blockRecord.createdAt)
        : "Unknown date";

      return {
        id: blockRecord._id, // Use block record _id for unblocking
        name,
        email,
        company,
        reason,
        blockedDate,
      };
    });
  }, [blockedUsersData]);

  const filteredUsers = blockedUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.company &&
        user.company.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSelectUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (isSelectAll) {
      setSelectedUsers([]);
      setIsSelectAll(false);
    } else {
      setSelectedUsers(filteredUsers.map((user) => user.id));
      setIsSelectAll(true);
    }
  };

  // Update isSelectAll when filteredUsers or selectedUsers change
  useEffect(() => {
    if (filteredUsers.length > 0) {
      setIsSelectAll(
        selectedUsers.length === filteredUsers.length &&
          filteredUsers.every((user) => selectedUsers.includes(user.id))
      );
    } else {
      setIsSelectAll(false);
    }
  }, [filteredUsers, selectedUsers]);

  const handleUnblockUser = (userId: string) => {
    setUserToUnblock(userId);
    setShowUnblockDialog(true);
  };

  const handleConfirmUnblock = async () => {
    if (!userToUnblock) return;

    await unblockUserMutation.mutateAsync(userToUnblock);
    toast.success(t.user.blockedUsers.userUnblocked);
    setShowUnblockDialog(false);
    setUserToUnblock(null);
  };

  const handleUnblockSelected = () => {
    if (selectedUsers.length === 0) {
      toast.error(t.user.blockedUsers.selectUsersToUnblock);
      return;
    }
    setShowUnblockSelectedDialog(true);
  };

  const handleConfirmUnblockSelected = async () => {
    // Unblock all selected users
    await Promise.all(
      selectedUsers.map((userId) => unblockUserMutation.mutateAsync(userId))
    );
    toast.success(
      t.user.blockedUsers.usersUnblocked.replace(
        "{count}",
        selectedUsers.length.toString()
      )
    );
    setSelectedUsers([]);
    setIsSelectAll(false);
    setShowUnblockSelectedDialog(false);
  };

  return (
    <Container1080>
      <MobileStickyHeader title={t.user.blockedUsers.pageTitle} />
      <div className="p-4 bg-gray-100 mb-4 rounded-lg block sm:hidden">
        <h3 className="text-sm text-black font-semibold mb-2 drop-shadow-lg">
          {t.user.blockedUsers.manageBlockedUsers}
        </h3>
        <p className="text-xs">{t.user.blockedUsers.blockedUsersDescription}</p>
      </div>

      <div className="sm:px-4 flex flex-col gap-5 sm:py-8">
        <div className="flex">
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
                id: "blocked-users",
                label: t.user.blockedUsers.blockedUsers,
                isActive: true,
              },
            ]}
            showSelectCategoryLink={false}
            showEllipsis={true}
            maxItems={3}
            variant="minimal"
            showHomeIcon={false}
            className="text-sm"
          />
        </div>

        <div className="sm:bg-white sm:rounded-2xl border-0 sm:border border-gray-200 sm:shadow-sm max-w-4xl w-full mx-auto">
          <div className="hidden sm:block text-center py-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {t.user.blockedUsers.blockedUsers}
            </h2>
          </div>

          <div className="px-6 sm:px-6 my-4 sm:mt-0">
            <div className="mb-6">
              <div className="relative">
                <Input
                  leftIcon={<Search className="size-5 text-gray-400" />}
                  type="text"
                  placeholder={t.user.blockedUsers.searchBlockedUsers}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 bg-white"
                />
              </div>
            </div>

            {filteredUsers.length > 0 && (
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSelectAll}
                    className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${
                      isSelectAll
                        ? "bg-purple-600 border-purple-600"
                        : "border-gray-300 hover:border-purple-400"
                    }`}
                  >
                    {isSelectAll && <Check className="w-3 h-3 text-white" />}
                  </button>
                  <span className="text-sm text-gray-700">
                    {t.user.blockedUsers.selectAll} ({filteredUsers.length})
                  </span>
                </div>

                {selectedUsers.length > 0 && (
                  <Button
                    onClick={handleUnblockSelected}
                    variant="outline"
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    {t.user.blockedUsers.unblockSelected} (
                    {selectedUsers.length})
                  </Button>
                )}
              </div>
            )}

            <div className="space-y-4">
              {isLoadingBlockedUsers ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">{t.common.loading}</p>
                </div>
              ) : blockedUsersError ? (
                <div className="text-center py-8">
                  <p className="text-red-500">{t.common.error}</p>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    {searchQuery
                      ? t.user.blockedUsers.noUsersFound
                      : t.user.blockedUsers.noBlockedUsers}
                  </p>
                </div>
              ) : (
                filteredUsers.map((user) => (
                  <BlockedUserItem
                    key={user.id}
                    id={user.id}
                    name={user.name}
                    email={user.email}
                    company={user.company}
                    reason={user.reason}
                    blockedDate={user.blockedDate}
                    isSelected={selectedUsers.includes(user.id)}
                    onSelect={handleSelectUser}
                    onUnblock={handleUnblockUser}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Unblock Single User Dialog */}
      <WarningConfirmationDialog
        open={showUnblockDialog}
        onOpenChange={setShowUnblockDialog}
        title={t.user.blockedUsers.confirmUnblock}
        description={t.user.blockedUsers.confirmUnblock}
        confirmText={t.user.blockedUsers.unblock}
        cancelText={t.common.cancel}
        onConfirm={handleConfirmUnblock}
        isLoading={unblockUserMutation.isPending}
        confirmVariant="danger"
      />

      {/* Unblock Selected Users Dialog */}
      <WarningConfirmationDialog
        open={showUnblockSelectedDialog}
        onOpenChange={setShowUnblockSelectedDialog}
        title={t.user.blockedUsers.confirmUnblockMultiple.replace(
          "{count}",
          selectedUsers.length.toString()
        )}
        description={t.user.blockedUsers.confirmUnblockMultiple.replace(
          "{count}",
          selectedUsers.length.toString()
        )}
        confirmText={t.user.blockedUsers.unblockSelected}
        cancelText={t.common.cancel}
        onConfirm={handleConfirmUnblockSelected}
        isLoading={unblockUserMutation.isPending}
        confirmVariant="danger"
      />
    </Container1080>
  );
};

export default BlockedUsersPage;
