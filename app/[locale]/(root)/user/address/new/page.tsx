"use client";

import { ChevronsRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import AddAddressForm from "../../_components/add-address-form";
import { useLocale } from "@/hooks/useLocale";
import { Container1080 } from "@/components/layouts/container-1080";

const page = () => {
  const { t, localePath } = useLocale();

  return (
    <Container1080 className="min-h-fit py-8 space-y-6">
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
    </Container1080>
  );
};

export default page;
