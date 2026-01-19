"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useGetMainCategories } from "@/hooks/useCategories";
import { useAdPostingStore } from "@/stores/adPostingStore";
import { useRouter } from "nextjs-toploader/app";
import { useMyOrganization } from "@/hooks/useOrganizations";
import OrganizationRequiredDialog from "@/app/[locale]/(root)/post-ad/_components/OrganizationRequiredDialog";
import {
  isJobCategory,
  hasOrganization,
} from "@/validations/post-ad.validation";
import { Container1080 } from "@/components/layouts/container-1080";

export default function SelectJobCategoryPage() {
  const router = useRouter();
  const {
    addToCategoryArray,
    setActiveCategory,
    setStep,
    categoryArray,
    clearCategoryArray,
  } = useAdPostingStore((state) => state);
  const [showOrgDialog, setShowOrgDialog] = useState(false);

  // Fetch categories using the hook
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useGetMainCategories();

  // Fetch user organizations
  const { data: organizationsData, isLoading: organizationsLoading } =
    useMyOrganization();
  const organizations = organizationsData?.data || [];

  // Filter for Job categories only
  const categories = categoriesData?.filter(cat => isJobCategory(cat.name)) || [];

  const handleCategorySelect = (categoryId: string) => {
    const selectedCategory = categories.find((cat) => cat._id === categoryId);

    if (selectedCategory) {
        // Ensure user has organization for jobs
        if (!hasOrganization(organizations)) {
          setShowOrgDialog(true);
          return; 
        }

      addToCategoryArray({
        id: selectedCategory._id,
        name: selectedCategory.name,
      });

      setActiveCategory(selectedCategory._id);
      setStep(2);
    }

    router.push(`/post-job/${categoryId}`);
  };

  useEffect(() => {
    if (categoryArray.length > 0) {
      clearCategoryArray();
    }
  }, [categoryArray, clearCategoryArray]);

  return (
    <Container1080>
      <OrganizationRequiredDialog
        isOpen={showOrgDialog}
        onClose={() => setShowOrgDialog(false)}
      />
      <div className=" w-full max-w-[888px] flex-1 mx-auto bg-white">
        <div className="w-full mx-auto bg-white">
          <div className="pb-8">
             <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#1D2939]">Post a Job</h1>
                <p className="text-[#667085] mt-1">Select a job category to get started</p>
             </div>
            
            <div className="space-y-[13px]">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-[13px]">
                {categoriesLoading || organizationsLoading ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={index}
                      className="bg-[#F7F8FA] rounded-lg p-[10px_18px] w-full h-[140px] flex flex-col items-center justify-center gap-4 animate-pulse"
                    >
                      <div className="w-[70px] h-[70px] bg-gray-300 rounded"></div>
                      <div className="h-4 w-16 bg-gray-300 rounded"></div>
                    </div>
                  ))
                ) : categoriesError ? (
                  <div className="col-span-full flex items-center justify-center py-8">
                    <div className="text-center">
                      <p className="text-gray-500 mb-2">
                        Failed to load categories
                      </p>
                      <button
                        onClick={() => window.location.reload()}
                        className="text-purple-600 hover:text-purple-700 text-sm underline"
                      >
                        Try again
                      </button>
                    </div>
                  </div>
                ) : categories.length > 0 ? (
                  categories.map((category) => (
                    <button
                      key={category._id}
                      onClick={() => handleCategorySelect(category._id)}
                      className="bg-[#F7F8FA] rounded-lg p-[10px_18px] w-full h-[140px] flex flex-col items-center justify-center gap-4 hover:bg-purple/10 hover:scale-105 cursor-pointer transition-all duration-300"
                    >
                      {category.icon && (
                        <div className="w-[70px] h-[70px] relative">
                          <Image
                            src={category.icon}
                            alt={category.name}
                            fill
                            unoptimized
                            className="object-cover rounded"
                          />
                        </div>
                      )}
                      <span className="text-sm font-semibold text-black text-center max-w-[130px] truncate whitespace-nowrap leading-tight">
                        {category.name}
                      </span>
                    </button>
                  ))
                ) : (
                    <div className="col-span-full text-center py-10">
                         <p className="text-gray-500">No Job categories found.</p>
                    </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container1080>
  );
}
