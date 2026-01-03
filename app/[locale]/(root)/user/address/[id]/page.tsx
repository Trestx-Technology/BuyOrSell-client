"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import AddAddressForm from "../../_components/add-address-form";
import { useLocale } from "@/hooks/useLocale";
import { Container1080 } from "@/components/layouts/container-1080";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { useGetAddressById, useUpdateAddress } from "@/hooks/useAddress";
import { toast } from "sonner";
import type { UpdateAddressPayload } from "@/interfaces/address.types";
import { ErrorCard } from "@/components/ui/error-card";
import { AddressFormData } from "@/schemas/address.schema";
import { MobileStickyHeader } from "@/components/global/mobile-sticky-header";

const EditAddressPage = () => {
  const { t, localePath } = useLocale();
  const router = useRouter();
  const params = useParams();
  const addressId = params.id as string;

  const updateAddressMutation = useUpdateAddress();
  const {
    data: addressData,
    isLoading: isLoadingAddress,
    error: addressError,
  } = useGetAddressById(addressId);

  const address = addressData?.data;

  // Map API address to form data
  const initialFormValues = useMemo<
    Partial<AddressFormData> | undefined
  >(() => {
    if (!address) return undefined;

    // Map type: "home" | "work" -> "home" | "office" | "other"
    const addressTypeForm =
      address.type === "work" ? "office" : address.type || "home";

    return {
      emirate: address.emirate || "",
      city: address.city || "",
      area: address.area || "",
      pincode: address.zipCode || "",
      street: address.street || "",
      addressType: addressTypeForm as "home" | "office" | "other",
      isPrimary: address.addressType === "primary",
    };
  }, [address]);

  const handleSubmit = async (formData: AddressFormData) => {
    if (!addressId) {
      toast.error("Address ID is missing");
      return;
    }

    // Map form data to API payload
    const addressType = formData.addressType === "office" ? "work" : "home";
    const addressTypePrimary = formData.isPrimary ? "primary" : "secondary";

    // Construct the full address string
    const fullAddress = `${formData.street}, ${formData.area}, ${formData.city}, ${formData.emirate}, ${formData.pincode}`;

    const payload: UpdateAddressPayload = {
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

    updateAddressMutation.mutate(
      { id: addressId, data: payload },
      {
        onSuccess: () => {
          toast.success("Address updated successfully");
          router.push(localePath("/user/address"));
        },
        onError: (error) => {
          toast.error(error.message || "Failed to update address");
        },
      }
    );
  };

  if (isLoadingAddress) {
    return (
      <Container1080 className="min-h-fit py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple mx-auto mb-4"></div>
            <p className="text-gray-600">Loading address...</p>
          </div>
        </div>
      </Container1080>
    );
  }

  if (addressError || !address) {
    return (
      <Container1080 className="min-h-fit py-8">
        <ErrorCard
          variant="error"
          title="Failed to load address"
          description={
            addressError?.message ||
            "Unable to fetch address. Please try again later."
          }
          className="max-w-md mx-auto"
        />
      </Container1080>
    );
  }

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
              id: "edit-address",
              label: t.user.address.addressDetails,
              isActive: true,
            },
          ]}
          showSelectCategoryLink={false}
          className="text-sm"
        />
      </div>
      <AddAddressForm
        onSubmit={handleSubmit}
        isLoading={updateAddressMutation.isPending}
        initialValues={initialFormValues}
      />
    </Container1080>
  );
};

export default EditAddressPage;
