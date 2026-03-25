import React from "react";
import Image from "next/image";
import { Metadata } from "next";
import Link from "next/link";
import { ICONS } from "@/constants/icons";
import { getBanners } from "@/app/api/banner/banner.services";

export const metadata: Metadata = {
  title: "Authentication - BuyOrSell",
  description: "Authentication forms built using the components.",
};

import { AuthGuard } from "./_components/auth-guard";

interface AuthRootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

const AuthRootLayout = async ({ children, params }: AuthRootLayoutProps) => {
  const { locale } = await params;

  // Fetch auth banner from API using slug "auth-banner"
  let bannerImage: string | null = null;
  try {
    const bannersResponse = await getBanners({ slug: "auth-banner", limit: 1 });
    const banners = bannersResponse?.data?.banners || [];
    if (banners.length > 0 && banners[0].image) {
      bannerImage = banners[0].image;
    }
  } catch (error) {
    console.error("Failed to fetch auth banner:", error);
  }

  return (
    <AuthGuard>
      <div className="bg-white dark:bg-gray-950">
        <div className="px-[12px] lg:px-[100px] min-h-[750px] w-screen max-w-[1280px] mx-auto flex flex-col">
          <Link href={`/${locale}`} className="mt-8">
            <Image src={ICONS.logo.main} width={156} height={49} alt="logo" />
          </Link>
          <main className="flex justify-center items-center relative gap-10 flex-1">
            {children}
            <div className="w-full sm:w-1/2 lg:block max-w-[530px] max-h-[603px] hidden h-full sm:h-auto">
              {bannerImage ? (
                <Image
                  src={bannerImage}
                  alt="Auth Banner"
                  width={530}
                  height={603}
                  className="w-full h-full object-cover rounded-2xl"
                />
              ) : (
                <div 
                  className="w-full h-full min-h-[603px] bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center justify-center"
                >
                  <div className="bg-white/50 dark:bg-gray-800/50 p-6 rounded-full grayscale opacity-20">
                    <Image src={ICONS.logo.main} width={120} height={40} alt="Logo Placeholder" />
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
};

export default AuthRootLayout;
