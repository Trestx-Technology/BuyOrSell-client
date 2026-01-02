"use client";

import React from "react";
import { useParams } from "next/navigation";
import SellerHeader from "../../_components/SellerHeader";
import SellerReviews from "../../_components/SellerReviews";
import SellerInfo from "../../_components/SellerInfo";
import SellerListings from "../../_components/SellerListings";
import SellerListingsMobileHeader from "../../_components/SellerListingsMobileHeader";
import Image from "next/image";
import { useGetUserById } from "@/hooks/useUsers";
import { Typography } from "@/components/typography";
import { User } from "@/interfaces/user.types";
import { Container1080 } from "@/components/layouts/container-1080";

const UserSellerPage: React.FC = () => {
  const { id } = useParams();
  const userId = id as string;

  // Fetch user data
  const {
    data: userData,
    isLoading,
    error: userError,
    isError: isUserError,
  } = useGetUserById(userId);

  const user = userData?.data;

  // Show loading state
  if (isLoading) {
    return (
      <div className="bg-[#F9FAFC] relative">
        <div className="pb-6 md:py-6">
          <div className="animate-pulse space-y-8">
            <div className="bg-gray-200 h-40 rounded-2xl" />
            <div className="bg-gray-200 h-64 rounded-xl" />
            <div className="bg-gray-200 h-48 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  // Show error state if user not found
  if (!user) {
    return (
      <div className="bg-[#F9FAFC] relative">
        <div className="pb-6 md:py-6">
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Typography variant="h2" className="text-dark-blue mb-2">
              User Not Found
            </Typography>
            <Typography variant="body" className="text-grey-blue">
              The user profile you're looking for doesn't exist.
            </Typography>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Container1080 className="relative">
      <div className="pb-6 md:py-6">
        {/* Seller Header */}
        <div className="hidden sm:block">
          <SellerHeader
            sellerId={userId}
            organization={undefined}
            user={user}
          />
        </div>

        {/* Seller Header Mobile */}
        <div className="block sm:hidden">
          <div className="sticky top-0 h-40 overflow-hidden">
            {/* TODO: Add cover image for individual seller */}
            <Typography variant="h2" className="text-dark-blue mb-2">
              {user?.firstName} {user?.lastName}
            </Typography>
          </div>
          <SellerListingsMobileHeader
            sellerId={userId}
            organization={undefined}
            user={user}
          />
        </div>

        {/* Seller Information */}
        <div className="mt-8">
          <SellerInfo sellerId={userId} organization={undefined} user={user} />
        </div>

        {/* Seller Reviews */}
        <div className="mt-8">
          <SellerReviews sellerId={userId} organization={undefined} />
        </div>

        {/* Seller Listings */}
        <div className="mt-8">
          <SellerListings
            sellerId={userId}
            organization={undefined}
            user={user}
          />
        </div>
      </div>
    </Container1080>
  );
};

export default UserSellerPage;
