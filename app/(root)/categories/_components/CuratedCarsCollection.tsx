"use client";

import React from "react";
import Image from "next/image";
import { Typography } from "@/components/typography";

interface CuratedCard {
  id: string;
  title: string;
  subtitle: string;
  image?: string;
  price?: string;
}

const curatedCards: CuratedCard[] = [
  {
    id: "1",
    title: "Budget Cars",
    subtitle: "Starting @ 9999",
    image:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "2",
    title: "SUV Cars",
    subtitle: "Stylish & Safe",
  },
  {
    id: "3",
    title: "CNG Cars",
    subtitle: "Cost-Effective Cars",
  },
  {
    id: "4",
    title: "Automatic Cars",
    subtitle: "Effortless Drives",
  },
  {
    id: "5",
    title: "Luxury Cars",
    subtitle: "Comfort with Class",
  },
  {
    id: "6",
    title: "Electric Cars",
    subtitle: "Zero Emissions Drive",
  },
  {
    id: "7",
    title: "Electric Cars",
    subtitle: "Zero Emissions Drive",
  },
  {
    id: "8",
    title: "Electric Cars",
    subtitle: "Zero Emissions Drive",
  },
];

const CuratedCarsCollection: React.FC = () => {
  return (
    <div className="w-full bg-teal/40 sm:rounded-xl p-4">
      {/* Title */}
      <div className="mb-4">
        <Typography
          variant="h3"
          className="text-[#1D2939] font-semibold text-base"
        >
          Curated Cars Collection
        </Typography>
      </div>

      {/* Horizontal Scrolling Cards */}
      <div
        className="overflow-x-auto pb-2 scrollbar-hide"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <div className="flex gap-4 w-max">
          {curatedCards.map((card) => (
            <div
              key={card.id}
              className="flex-shrink-0 w-[117px] h-[128px] bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer group"
            >
              <div className="p-1 h-full flex flex-col">
                {/* Image Section */}
                <div className="relative w-full h-[73px] bg-gray-100 rounded-lg overflow-hidden mb-2">
                  {card.image ? (
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <div className="w-6 h-6 bg-gray-300 rounded flex items-center justify-center">
                        <svg
                          width="17"
                          height="17"
                          viewBox="0 0 17 17"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8.5 0L10.8 6.2L17 6.2L11.6 10L13.9 16.2L8.5 12.4L3.1 16.2L5.4 10L0 6.2L6.2 6.2L8.5 0Z"
                            fill="#8A8A8A"
                          />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="flex-1 flex flex-col justify-between px-2 pb-1">
                  <Typography
                    variant="body-small"
                    className="text-[#1D2939] font-medium text-xs leading-tight text-center"
                  >
                    {card.title}
                  </Typography>

                  <Typography
                    variant="body-small"
                    className="text-[#667085] text-[10px] leading-tight text-center"
                  >
                    {card.subtitle}
                  </Typography>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CuratedCarsCollection;
