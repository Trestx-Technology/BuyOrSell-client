import { ChevronsRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import AddAddressForm from "../../_components/add-address-form";

const page = () => {
  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col gap-5 py-8">
      <div className="flex items-center gap-2">
        <Link
          href={"/user/address"}
          className="text-gray-400 font-semibold text-sm hover:text-purple"
        >
          My Address
        </Link>
        <ChevronsRight className="size-6 text-purple" />
        <Link
          href={"/user/address/new"}
          className="text-purple-600 font-semibold text-sm"
        >
          Address Details
        </Link>
      </div>
      <AddAddressForm />
    </div>
  );
};

export default page;
