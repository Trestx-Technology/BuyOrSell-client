"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MOTORS_ICONS } from "@/constants/icons";
import Image from "next/image";
import { useAdPosting } from "../_context/AdPostingContext";

// Category data based on Figma design
const categories = [
  {
    id: "cars",
    name: "Cars",
    icon: MOTORS_ICONS.cars,
    color: "text-red-500",
    bgColor: "bg-red-50",
  },
  {
    id: "bikes",
    name: "Bikes",
    icon: MOTORS_ICONS.motorcycle,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    id: "boats",
    name: "Boats",
    icon: MOTORS_ICONS.cruiseShip,
    color: "text-cyan-500",
    bgColor: "bg-cyan-50",
  },
  {
    id: "heavy-vehicles",
    name: "Heavy Vehicles",
    icon: MOTORS_ICONS.crane,
    color: "text-yellow-500",
    bgColor: "bg-yellow-50",
  },
  {
    id: "others",
    name: "Others",
    icon: MOTORS_ICONS.others,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
];

export default function CategoryTraversalPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { nextStep, prevStep, selectCategory } = useAdPosting();
  return (
    <section className="h-full md:h-[420px] md:overflow-y-auto">
      <div className="flex-1 w-full max-w-[888px] mx-auto mb-5">
        <div className="flex h-full gap-10">
          {/* Left Column - Categories */}
          <div className="w-full md:w-2/3 h-full">
            <div className="space-y-3">
              {categories.map((category) => {
                const isSelected = selectedCategory === category.id;

                return (
                  <button
                    key={category.id}
                    onClick={() => {
                      setSelectedCategory(category.id);
                      selectCategory(category.id);
                    }}
                    className={`w-full p-2 rounded-lg border-2 transition-all duration-200 hover:shadow-md cursor-pointer ${
                      isSelected
                        ? "border-purple bg-purple/10"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div
                          className={`size-[50px] bg-[#F7F8FA] rounded-lg flex items-center justify-center`}
                        >
                          <Image
                            src={category.icon}
                            alt={category.name}
                            width={50}
                            height={50}
                            className={`object-cover ${category.color}`}
                          />
                        </div>
                        <span className="text-lg font-medium text-gray-900">
                          {category.name}
                        </span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column - Image Upload Area */}
          <div className="sticky top-0 bg-gray-100 hidden md:flex flex-1 p-6 w-1/3 max-h-[420px] rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer className="w-full bg-white sticky md:fixed bottom-0 left-0 right-0 max-w-[1080px] mx-auto md:border-t px-5 py-5">
        <div className="flex w-full justify-between max-w-[888px] mx-auto gap-3">
          <Button
            className="w-full"
            onClick={() => prevStep()}
            variant={"outline"}
          >
            Back
          </Button>
          <Button
            className="w-full"
            onClick={() => nextStep()}
            variant={"primary"}
            disabled={!selectedCategory}
          >
            Next
          </Button>
        </div>
      </footer>
    </section>
  );
}
