"use client";

import { ChevronsRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import AddAddressForm from "../../_components/add-address-form";
import { useLocale } from "@/hooks/useLocale";

const page = () => {
  const { t, localePath } = useLocale();

  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col gap-5 py-8">
      <div className="flex items-center gap-2">
        <Link
          href={localePath("/user/address")}
          className="text-gray-400 font-semibold text-sm hover:text-purple"
        >
          {t.user.address.myAddress}
        </Link>
        <ChevronsRight className="size-6 text-purple" />
        <Link
          href={localePath("/user/address/new")}
          className="text-purple-600 font-semibold text-sm"
        >
          {t.user.address.addressDetails}
        </Link>
      </div>
      <AddAddressForm />
    </div>
  );
};

export default page;

