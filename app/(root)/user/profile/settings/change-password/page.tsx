"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronsRight, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/typography";

const ChangePasswordPage = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleInputChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.currentPassword ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      alert("Please fill in all fields");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      alert("New passwords don't match");
      return;
    }

    if (formData.newPassword.length < 8) {
      alert("Password must be at least 8 characters long");
      return;
    }

    // Here you would typically make an API call to change the password
    console.log("Changing password:", formData);
    alert("Password changed successfully!");
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
          Change Password
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
            Change Password
          </span>
        </div>

        {/* Settings Card */}
        <div className="sm:bg-white sm:rounded-2xl border-0 sm:border border-gray-200 sm:shadow-sm max-w-2xl w-full mx-auto">
          {/* Header */}
          <div className="hidden sm:block text-center py-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Change Password
            </h2>
          </div>

          <div className="px-6 sm:px-6">
            {/* Security Notice */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                Keep Your Account Secure
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Choose a strong password that you haven&apos;t used elsewhere.
                We&apos;ll never share your password with anyone.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    value={formData.currentPassword}
                    onChange={handleInputChange("currentPassword")}
                    placeholder="Enter your current password"
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("current")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.current ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    value={formData.newPassword}
                    onChange={handleInputChange("newPassword")}
                    placeholder="Enter your new password"
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("new")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.new ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleInputChange("confirmPassword")}
                    placeholder="Confirm your new password"
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("confirm")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.confirm ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Security Tips */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Security Tips
                </h3>
                <ul className="space-y-1 text-xs text-gray-600">
                  <li>• Use a unique password for this account</li>
                  <li>• Don&apos;t share your password with anyone</li>
                  <li>• Consider using a password manager</li>
                  <li>• Change your password regularly</li>
                </ul>
              </div>
            </form>

            {/* Change Password Button */}
            <div className="mt-6 mb-6">
              <Button
                onClick={handleSubmit}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-base font-medium"
              >
                Change Password
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
