"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/typography";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { useLocale } from "@/hooks/useLocale";
import { useRouter } from "nextjs-toploader/app";
import { Container1080 } from "@/components/layouts/container-1080";
import { FormField } from "@/app/[locale]/(root)/post-ad/details/_components/FormField";
import {
  changePasswordSchema,
  type ChangePasswordFormData,
} from "@/schemas/change-password.schema";
import { useChangePassword } from "@/hooks/useAuth";
import { toast } from "sonner";
import { MobileStickyHeader } from "@/components/global/mobile-sticky-header";

const ChangePasswordPage = () => {
  const { t, localePath } = useLocale();
  const router = useRouter();
  const changePasswordMutation = useChangePassword();

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const onSubmit = (data: ChangePasswordFormData) => {
    changePasswordMutation.mutate(
      {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      },
      {
        onSuccess: () => {
          toast.success(t.user.changePassword.passwordChangedSuccess);
          router.push(localePath("/user/profile"));
        },
      }
    );
  };

  const isLoading = changePasswordMutation.isPending || isSubmitting;

  return (
    <Container1080>
      <MobileStickyHeader title={t.user.changePassword.pageTitle} />

      <div className="px-4 py-8 space-y-6">
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
              id: "change-password",
              label: t.user.changePassword.changePassword,
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

        <div className="sm:bg-white sm:rounded-2xl border-0 sm:border border-gray-200 sm:shadow-sm max-w-2xl w-full mx-auto">
          <div className="hidden sm:block text-center py-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {t.user.changePassword.changePassword}
            </h2>
          </div>

          <div className="px-4">
            <div className="bg-gray-50 rounded-xl border p-4 mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                {t.user.changePassword.keepAccountSecure}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                {t.user.changePassword.securityNotice}
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                label={t.user.changePassword.currentPassword}
                error={errors.currentPassword?.message}
              >
                <div className="relative">
                  <Controller
                    name="currentPassword"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        rightIcon={
                          showPasswords.current ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )
                        }
                        onRightIconClick={() =>
                          togglePasswordVisibility("current")
                        }
                        type={showPasswords.current ? "text" : "password"}
                        placeholder={t.user.changePassword.enterCurrentPassword}
                        className="w-full pr-10"
                        error={errors.currentPassword?.message}
                      />
                    )}
                  />
                </div>
              </FormField>

              <FormField
                label={t.user.changePassword.newPassword}
                error={errors.newPassword?.message}
              >
                <div className="relative">
                  <Controller
                    name="newPassword"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        rightIcon={
                          showPasswords.new ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )
                        }
                        onRightIconClick={() => togglePasswordVisibility("new")}
                        type={showPasswords.new ? "text" : "password"}
                        placeholder={t.user.changePassword.enterNewPassword}
                        className="w-full pr-10"
                        error={errors.newPassword?.message}
                      />
                    )}
                  />
                </div>
              </FormField>

              <FormField
                label={t.user.changePassword.confirmPassword}
                error={errors.confirmPassword?.message}
              >
                <div className="relative">
                  <Controller
                    name="confirmPassword"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        rightIcon={
                          showPasswords.confirm ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )
                        }
                        onRightIconClick={() =>
                          togglePasswordVisibility("confirm")
                        }
                        type={showPasswords.confirm ? "text" : "password"}
                        placeholder={t.user.changePassword.confirmNewPassword}
                        className="w-full pr-10"
                        error={errors.confirmPassword?.message}
                      />
                    )}
                  />
                </div>
              </FormField>

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

              <div className="py-4">
                <Button
                  type="submit"
                  isLoading={isLoading}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-base font-medium"
                  disabled={isLoading}
                >
                  {isLoading
                    ? "Changing..."
                    : t.user.changePassword.changePassword}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Container1080>
  );
};

export default ChangePasswordPage;
