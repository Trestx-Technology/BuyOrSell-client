"use client";

import Image from "next/image";
import Link from "next/link";
import { H1, H3 } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Container1080 } from "@/components/layouts/container-1080";

const EmiratisSupport = () => {
  return (
    <Container1080 className="px-4 my-10">
      <div className="relative h-[388px] bg-[#CEFFF2] rounded-2xl border-[0.5px] border-[#E2E2E2] shadow-[0px_2.67px_7.11px_0px_rgba(48,150,137,0.08)] overflow-hidden">
        {/* Content Section - positioned at x:44, y:83 */}
        <div className="absolute left-11 top-[83px] flex flex-col gap-6 w-[659px]">
          {/* Title and Subtitle Group */}
          <div className="flex flex-col gap-6">
            <H1
              className="font-bold leading-[1.21] uppercase text-[#1D2939]"
            >
              Supporting Emiratisation
            </H1>
            <H3
              className="font-normal leading-[1.21] uppercase text-[#1D2939]"
            >
              Connecting UAE citizens to jobs & Opportunities
            </H3>
          </div>

          {/* Button - positioned at y:187 from content top */}
          <Link href="/jobs/listing/Jobs" className="w-[165px]">
            <Button
              className="w-[165px] h-10 px-[17.78px] py-[12.44px] rounded-[7.11px] text-[14.22px] font-bold leading-[1.21] uppercase bg-purple text-white border border-purple hover:bg-purple/90 transition-all"
              variant="primary"
            >
              Browse Jobs
            </Button>
          </Link>
        </div>

        {/* Image Section - positioned at x:713.06, y:0 */}
        <div className="absolute right-0 top-0 w-[277.23px] h-[388px]">
          <Image
            src="https://dev-buyorsell.s3.me-central-1.amazonaws.com/assets/support-emarati.png"
            alt="UAE Flag Hand"
            width={277}
            height={388}
            className="w-full h-full object-cover"
            priority
          />
        </div>
      </div>
    </Container1080>
  );
};

export default EmiratisSupport;
