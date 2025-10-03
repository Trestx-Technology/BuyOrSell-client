"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronsRight, Search, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/typography";

interface BlockedUser {
  id: string;
  name: string;
  email: string;
  company: string;
  reason: string;
  blockedDate: string;
}

const BlockedUsersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isSelectAll, setIsSelectAll] = useState(false);

  // Mock data - replace with actual API data
  const [blockedUsers] = useState<BlockedUser[]>([
    {
      id: "1",
      name: "John Smith",
      email: "john.smith@spamcompany.com",
      company: "SpamCorp Inc.",
      reason: "Excessive contact attempts",
      blockedDate: "10/01/2024",
    },
    {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah.j@marketingspam.com",
      company: "MarketingSpam LLC",
      reason: "Unsolicited advertising",
      blockedDate: "09/28/2024",
    },
    {
      id: "3",
      name: "Mike Davis",
      email: "mike.davis@fakeleads.com",
      company: "FakeLeads Co.",
      reason: "Suspicious activity",
      blockedDate: "09/15/2024",
    },
  ]);

  const filteredUsers = blockedUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.company.toLowerCase().includes(searchQuery.toLowerCase())
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
    } else {
      setSelectedUsers(filteredUsers.map((user) => user.id));
    }
    setIsSelectAll(!isSelectAll);
  };

  const handleUnblockUser = (userId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to unblock this user? They will be able to contact you again."
    );
    if (confirmed) {
      console.log("Unblocking user:", userId);
      // Here you would typically make an API call to unblock the user
      alert("User has been unblocked successfully!");
    }
  };

  const handleUnblockSelected = () => {
    if (selectedUsers.length === 0) {
      alert("Please select users to unblock");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to unblock ${selectedUsers.length} user(s)?`
    );
    if (confirmed) {
      console.log("Unblocking users:", selectedUsers);
      // Here you would typically make an API call to unblock multiple users
      alert(
        `${selectedUsers.length} user(s) have been unblocked successfully!`
      );
      setSelectedUsers([]);
      setIsSelectAll(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50">
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
          Blocked Users
        </Typography>
      </div>

      <div className="p-4 bg-gray-100 mb-4 rounded-lg block sm:hidden">
        <h3 className="text-sm text-black font-semibold mb-2 drop-shadow-lg">
          Manage Blocked Users
        </h3>
        <p className="text-xs">
          Blocked users cannot contact you or view your profile. You can unblock
          them anytime.
        </p>
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
            Blocked Users
          </span>
        </div>

        {/* Main Card */}
        <div className="sm:bg-white sm:rounded-2xl border-0 sm:border border-gray-200 sm:shadow-sm max-w-4xl w-full mx-auto">
          {/* Header */}
          <div className="hidden sm:block text-center py-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Blocked Users
            </h2>
          </div>

          <div className="px-6 sm:px-6 mt-4 sm:mt-0">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search Blocked users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-sm"
                />
              </div>
            </div>

            {/* Select All */}
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
                    Select all ({filteredUsers.length})
                  </span>
                </div>

                {selectedUsers.length > 0 && (
                  <Button
                    onClick={handleUnblockSelected}
                    variant="outline"
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    Unblock Selected ({selectedUsers.length})
                  </Button>
                )}
              </div>
            )}

            {/* Blocked Users List */}
            <div className="space-y-4">
              {filteredUsers.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    {searchQuery
                      ? "No users found matching your search."
                      : "No blocked users."}
                  </p>
                </div>
              ) : (
                filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                  >
                    <div className="flex items-start gap-4">
                      {/* Checkbox */}
                      <button
                        onClick={() => handleSelectUser(user.id)}
                        className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors flex-shrink-0 mt-1 ${
                          selectedUsers.includes(user.id)
                            ? "bg-purple-600 border-purple-600"
                            : "border-gray-300 hover:border-purple-400"
                        }`}
                      >
                        {selectedUsers.includes(user.id) && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </button>

                      {/* User Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-sm font-semibold text-gray-900">
                            {user.name}
                          </h3>
                          <button
                            onClick={() => handleUnblockUser(user.id)}
                            className="text-sm text-red-600 hover:text-red-700 font-medium"
                          >
                            Unblock
                          </button>
                        </div>

                        <p className="text-sm text-gray-700 mb-1">
                          {user.email}
                        </p>
                        <p className="text-xs text-gray-500 mb-2">
                          {user.company}
                        </p>

                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-700">
                            {user.reason}
                          </span>
                          <span className="text-xs text-gray-500">
                            Blocked on {user.blockedDate}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockedUsersPage;
