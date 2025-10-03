"use client";

import React from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import AddressCard from "../_components/address-card";
import { RadioGroup } from "@/components/ui/radio-group";

const AddressPage = () => {
  // Mock address data - replace with actual data from API
  const addresses = [
    {
      id: "1",
      type: "home" as const,
      label: "Home",
      address: `Fishing Harbour, 2b Street, Umm Suqeim, Dubai, United Arab Emirates`,
      isPrimary: true,
    },
    {
      id: "2",
      type: "office" as const,
      label: "Office",
      address:
        "Fishing Harbour, 2b Street, Umm Suqeim, Dubai, United Arab Emirates",
      isPrimary: false,
    },
  ];

  const handleEditAddress = (id: string) => {
    console.log("Edit address:", id);
    // Navigate to edit address page or open edit modal
  };

  return (
    <div className="bg-gray-50 py-8">
      <Link
        href={"/user/address"}
        className="text-purple-600 font-semibold text-sm"
      >
        My Address
      </Link>

      <div className="bg-white mx-auto w-full max-w-2xl shadow p-4 rounded-lg my-8">
        <h3 className="text-md font-semibold text-gray-900 font-poppins text-center">
          My Addresses
        </h3>
        {/* Address Cards */}
        <RadioGroup defaultValue="home">
          <div className="space-y-4 mt-4 mb-8">
            {addresses.map((address) => (
              <AddressCard
                key={address.id}
                {...address}
                onEdit={handleEditAddress}
              />
            ))}
          </div>
        </RadioGroup>

        {/* Add More Address Button */}
        <div className="flex justify-center">
          <Link href="/user/address/new" className="w-full">
            <Button
              variant={"outlined"}
              icon={<PlusCircle className="w-5 h-5 -mr-2" />}
              iconPosition="center"
              className="w-full px-6 py-3 rounded-lg font-medium"
            >
              Add More Address
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AddressPage;
