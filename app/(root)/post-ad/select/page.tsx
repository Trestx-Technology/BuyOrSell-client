"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAdPosting } from "../_context/AdPostingContext";
import { CATEGORY_ICONS } from "@/constants/icons";
import { Breadcrumbs, BreadcrumbItem } from "@/components/ui/breadcrumbs";

const categories = [
  {
    id: "motors",
    name: "Motors",
    icon: CATEGORY_ICONS.motors,
  },
  {
    id: "property-rent",
    name: "Property for Rent",
    icon: CATEGORY_ICONS.rent,
  },
  {
    id: "property-sale",
    name: "Property for Sale",
    icon: CATEGORY_ICONS.sale,
  },
  {
    id: "electronics",
    name: "Electronics",
    icon: CATEGORY_ICONS.electronics,
  },
  {
    id: "community",
    name: "Community",
    icon: CATEGORY_ICONS.community,
  },
  {
    id: "business",
    name: "Business",
    icon: CATEGORY_ICONS.business,
  },
  {
    id: "home-appliances",
    name: "Home Appliances",
    icon: CATEGORY_ICONS.electronics,
  },
  {
    id: "furniture",
    name: "Furniture",
    icon: CATEGORY_ICONS.furniture,
  },
  {
    id: "classifieds",
    name: "Classifieds",
    icon: CATEGORY_ICONS.classifieds,
  },
  {
    id: "jobs",
    name: "Jobs",
    icon: CATEGORY_ICONS.jobs,
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

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Post Ad", href: "/post-ad" },
    { label: "Select Category", isActive: true },
  ];

  const handleBreadcrumbClick = (item: BreadcrumbItem) => {
    if (item.href) {
      router.push(item.href);
    }
  };

  return (
    <div className=" w-full max-w-[888px] flex-1 mx-auto bg-white">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <Breadcrumbs
          items={breadcrumbItems}
          onItemClick={handleBreadcrumbClick}
        />
      </div>

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
