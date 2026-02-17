"use client";

import React, { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import AddressCard from "../_components/address-card";
import { RadioGroup } from "@/components/ui/radio-group";
import { useLocale } from "@/hooks/useLocale";
import { Container1080 } from "@/components/layouts/container-1080";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { useGetMyAddresses, useDeleteAddress } from "@/hooks/useAddress";
import { ErrorCard } from "@/components/ui/error-card";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { WarningConfirmationDialog } from "@/components/ui/warning-confirmation-dialog";
import { MobileStickyHeader } from "@/components/global/mobile-sticky-header";

const AddressPage = () => {
  const { t, localePath } = useLocale();
  const router = useRouter();
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);

  const { data: addressesData, isLoading, error } = useGetMyAddresses();
  const deleteAddressMutation = useDeleteAddress();

  const handleEditAddress = (id: string) => {
    router.push(localePath(`/user/address/${id}`));
  };

  const handleDeleteAddress = (id: string) => {
    setAddressToDelete(id);
  };

  const handleConfirmDelete = () => {
    if (!addressToDelete) return;

    deleteAddressMutation.mutate(addressToDelete, {
      onSuccess: () => {
        toast.success("Address deleted successfully");
        setAddressToDelete(null);
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete address");
      },
    });
  };

  // Map API response to AddressCard props
  const addresses =
    addressesData?.data?.map((address) => {
      const label =
        address.type === "home"
          ? t.user.address.home
          : address.type === "work"
          ? t.user.address.office
          : t.user.address.other;
      return {
        id: address._id,
        label,
        address: address.address,
        isPrimary: address.addressType === "primary",
      };
    }) || [];

  if (isLoading) {
    return (
      <Container1080 className="min-h-fit py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple mx-auto mb-4"></div>
            <p className="text-gray-600">Loading addresses...</p>
          </div>
        </div>
      </Container1080>
    );
  }

  if (error) {
    return (
      <Container1080 className="min-h-fit py-8">
        <ErrorCard
          variant="error"
          title={t.user.address.noAddresses || "Failed to load addresses"}
          description="Unable to fetch addresses. Please try again later."
          className="max-w-md mx-auto"
        />
      </Container1080>
    );
  }

  return (
    <Container1080 className="py-8">
      <MobileStickyHeader title={t.user.address.myAddress} />
      <Breadcrumbs
        items={[
          {
            id: "profile",
            label: t.user.profile.myProfile,
            href: localePath("/user/profile"),
          },
          {
            id: "address",
            label: t.user.address.myAddress,
            isActive: true,
          },
        ]}
        showSelectCategoryLink={false}
        className="text-sm px-4"
      />

      <div className="bg-white dark:bg-gray-900 mx-auto w-full max-w-2xl shadow p-4 rounded-lg my-8">
        <h3 className="text-md font-semibold text-gray-900 dark:text-white font-poppins text-center">
          {t.user.address.myAddresses}
        </h3>
        {/* Address Cards */}
        {addresses.length > 0 ? (
          <RadioGroup defaultValue={addresses[0].id}>
            <div className="space-y-4 mt-4 mb-8">
              {addresses.map((address) => (
                <AddressCard
                  key={address.id}
                  {...address}
                  onEdit={handleEditAddress}
                  onDelete={handleDeleteAddress}
                />
              ))}
            </div>
          </RadioGroup>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">{t.user.address.noAddresses}</p>
          </div>
        )}

        {/* Add More Address Button */}
        <div className="flex justify-center">
          <Link href={localePath("/user/address/new")} className="w-full">
            <Button
              variant={"outlined"}
              icon={<PlusCircle className="w-5 h-5 -mr-2" />}
              iconPosition="center"
              className="w-full px-6 py-3 rounded-lg font-medium"
            >
              {t.user.address.addMoreAddress}
            </Button>
          </Link>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <WarningConfirmationDialog
        open={addressToDelete !== null}
        onOpenChange={(open) => !open && setAddressToDelete(null)}
        title={t.user.address.delete || "Delete Address"}
        description="Are you sure you want to delete this address? This action cannot be undone."
        confirmText={t.user.address.delete || "Delete"}
        cancelText={t.common.cancel || "Cancel"}
        onConfirm={handleConfirmDelete}
        isLoading={deleteAddressMutation.isPending}
        confirmVariant="danger"
      />
    </Container1080>
  );
};

export default AddressPage;
