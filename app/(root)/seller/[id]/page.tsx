"use client";

import React from "react";
import { useParams } from "next/navigation";

import Image from "next/image";
import SellerListingsMobileHeader from "@/app/[locale]/(root)/seller/_components/SellerListingsMobileHeader";
import SellerInfo from "@/app/[locale]/(root)/seller/_components/SellerInfo";
import SellerReviews from "@/app/[locale]/(root)/seller/_components/SellerReviews";
import SellerListings from "@/app/[locale]/(root)/seller/_components/SellerListings";
import SellerHeader from "@/app/[locale]/(root)/seller/_components/SellerHeader";

const SellerDetailPage: React.FC = () => {
  const params = useParams();
  const sellerId = params.id as string;

  return (
    <div className="bg-[#F9FAFC] relative">
      <div className="pb-6 md:py-6">
        {/* Seller Header */}
        <div className="hidden sm:block">
          <SellerHeader sellerId={sellerId} />
        </div>

        {/* Seller Header Mobile */}
        <div className="block sm:hidden">
          <div className="sticky top-0 h-40 overflow-hidden">
            <Image
              src={"/seller-banner.png"}
              alt="Seller banner"
              fill
              className="object-cover object-center"
            />
          </div>
          <SellerListingsMobileHeader sellerId={sellerId} />
        </div>

        {/* Seller Information */}
        <div className="mt-8">
          <SellerInfo sellerId={sellerId} />
        </div>

        {/* Seller Reviews */}
        <div className="mt-8">
          <SellerReviews sellerId={sellerId} />
        </div>

        {/* Seller Listings */}
        <div className="mt-8">
          <SellerListings sellerId={sellerId} />
        </div>
      </div>
    </div>
  );
};

export default SellerDetailPage;
