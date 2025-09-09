"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Home, House } from "lucide-react";
import ProgressBar from "../_components/ProgressBar";
import { useAdPosting } from "../_context/AdPostingContext";

const categories = [
  {
    id: "motors",
    name: "Motors",
    icon: "/images/category-icons/motors-icon.png",
  },
  {
    id: "property-rent",
    name: "Property for Rent",
    icon: "/images/category-icons/property-rent-icon.png",
  },
  {
    id: "property-sale",
    name: "Property for Sale",
    icon: "/images/category-icons/property-sale-icon.png",
  },
  {
    id: "electronics",
    name: "Electronics",
    icon: "/images/category-icons/electronics-icon.png",
  },
  {
    id: "community",
    name: "Community",
    icon: "/images/category-icons/community-icon.png",
  },
  {
    id: "business",
    name: "Business",
    icon: "/images/category-icons/business-icon.png",
  },
  {
    id: "home-appliances",
    name: "Home Appliances",
    icon: "/images/category-icons/home-appliances-icon.png",
  },
  {
    id: "furniture",
    name: "Furniture",
    icon: "/images/category-icons/furniture-icon.png",
  },
  {
    id: "classifieds",
    name: "Classifieds",
    icon: "/images/category-icons/classifieds-icon.png",
  },
  {
    id: "jobs",
    name: "Jobs",
    icon: "/images/category-icons/jobs-icon.png",
  },
];

export default function SelectCategoryPage() {
  const router = useRouter();
  const { updateFormData, nextStep } = useAdPosting();

  const handleCategorySelect = (categoryId: string) => {
    updateFormData({
      category: categoryId,
      categoryPath: [categoryId],
      subcategory: "",
    });
    nextStep();
  };

  return (
    <div className=" w-full max-w-[888px] flex-1 mx-auto bg-white">
      {/* Main Container */}
      <div className="w-full mx-auto bg-white">

        {/* Main Content */}
        <div className="pb-8">
          {/* Categories Grid */}
          <div className="space-y-[13px]">
            {/* First Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-[13px]">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category.id)}
                  className="bg-[#F7F8FA] rounded-lg p-[10px_18px] w-full h-[140px] flex flex-col items-center justify-center gap-4 hover:bg-gray-100 hover:bg-purple/10 hover:scale-105 cursor-pointer transition-all duration-300"
                >
                  <div className="w-[70px] h-[70px] relative">
                    <Image
                      src={category.icon}
                      alt={category.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <span className="text-sm font-semibold text-black text-center max-w-[130px] truncate whitespace-nowrap leading-tight">
                    {category.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
