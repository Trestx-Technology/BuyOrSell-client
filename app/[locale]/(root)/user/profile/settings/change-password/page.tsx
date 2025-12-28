"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronsRight, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/typography";
import { useLocale } from "@/hooks/useLocale";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const ChangePasswordPage = () => {
  const { t, localePath } = useLocale();
  const router = useRouter();
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

    if (
      !formData.currentPassword ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      toast.error(t.user.changePassword.fillAllFields);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error(t.user.changePassword.passwordsDontMatch);
      return;
    }

    if (formData.newPassword.length < 8) {
      toast.error(t.user.changePassword.passwordTooShort);
      return;
    }

    console.log("Changing password:", formData);
    toast.success(t.user.changePassword.passwordChangedSuccess);
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
          {t.user.changePassword.pageTitle}
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
            {t.user.changePassword.changePassword}
          </span>
        </div>

        <div className="sm:bg-white sm:rounded-2xl border-0 sm:border border-gray-200 sm:shadow-sm max-w-2xl w-full mx-auto mt-4">
          <div className="hidden sm:block text-center py-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {t.user.changePassword.changePassword}
            </h2>
          </div>

          <div className="px-6 sm:px-6">
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                {t.user.changePassword.keepAccountSecure}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                {t.user.changePassword.securityNotice}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  {t.user.changePassword.currentPassword}
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    value={formData.currentPassword}
                    onChange={handleInputChange("currentPassword")}
                    placeholder={t.user.changePassword.enterCurrentPassword}
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

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  {t.user.changePassword.newPassword}
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    value={formData.newPassword}
                    onChange={handleInputChange("newPassword")}
                    placeholder={t.user.changePassword.enterNewPassword}
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

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  {t.user.changePassword.confirmPassword}
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleInputChange("confirmPassword")}
                    placeholder={t.user.changePassword.confirmNewPassword}
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

              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  {t.user.changePassword.securityTips}
                </h3>
                <ul className="space-y-1 text-xs text-gray-600">
                  <li>• {t.user.changePassword.securityTip1}</li>
                  <li>• {t.user.changePassword.securityTip2}</li>
                  <li>• {t.user.changePassword.securityTip3}</li>
                  <li>• {t.user.changePassword.securityTip4}</li>
                </ul>
              </div>
            </form>

            <div className="mt-6 mb-6">
              <Button
                onClick={handleSubmit}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-base font-medium"
              >
                {t.user.changePassword.changePassword}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;

