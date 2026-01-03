"use client";

import React from "react";
import AddAddressForm from "../../_components/add-address-form";
import { useLocale } from "@/hooks/useLocale";
import { Container1080 } from "@/components/layouts/container-1080";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { useCreateAddress } from "@/hooks/useAddress";
import { useGetProfile } from "@/hooks/useUsers";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { CreateAddressPayload } from "@/interfaces/address.types";
import { MobileStickyHeader } from "@/components/global/mobile-sticky-header";

const page = () => {
  const { t, localePath } = useLocale();
  const router = useRouter();
  const createAddressMutation = useCreateAddress();
  const { data: profileData } = useGetProfile();

  const handleSubmit = async (formData: {
    emirate: string;
    city: string;
    area: string;
    pincode: string;
    street: string;
    addressType: "home" | "office" | "other";
    isPrimary: boolean;
  }) => {
    const userId = profileData?.data?.user?._id;
    if (!userId) {
      toast.error("Unable to get user information");
      return;
    }

    // Map form data to API payload
    const addressType = formData.addressType === "office" ? "work" : "home";
    const addressTypePrimary = formData.isPrimary ? "primary" : "secondary";

    // Construct the full address string
    const fullAddress = `${formData.street}, ${formData.area}, ${formData.city}, ${formData.emirate}, ${formData.pincode}`;

    const payload: CreateAddressPayload = {
      userID: userId,
      emirate: formData.emirate,
      street: formData.street,
      country: "UAE",
      zipCode: formData.pincode,
      city: formData.city,
      address: fullAddress,
      addressType: addressTypePrimary,
      area: formData.area,
      type: addressType,
    };

    createAddressMutation.mutate(payload, {
      onSuccess: () => {
        toast.success("Address created successfully");
        router.push(localePath("/user/address"));
      },
      onError: (error) => {
        toast.error(error.message || "Failed to create address");
      },
    });
  };

  return (
    <Container1080>
      <MobileStickyHeader title={t.user.address.addressDetails} />
      <div className="px-4 py-8 space-y-6">
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
              href: localePath("/user/address"),
            },
            {
              id: "new-address",
              label: t.user.address.addressDetails,
              isActive: true,
            },
          ]}
          showSelectCategoryLink={false}
          showHomeIcon={false}
          className="text-sm"
        />
        <AddAddressForm
          onSubmit={handleSubmit}
          isLoading={createAddressMutation.isPending}
        />
      </div>
    </Container1080>
  );
};

export default page;
