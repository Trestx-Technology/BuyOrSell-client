import React from "react";
import Image from "next/image";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Metadata } from "next";
import Link from "next/link";
import { AuthGuard } from "./_components/auth-guard";
import { ICONS } from "@/constants/icons";

export const metadata: Metadata = {
  title: "Authentication - BuyOrSell",
  description: "Authentication forms built using the components.",
};

interface AuthRootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

const AuthRootLayout = async ({ children, params }: AuthRootLayoutProps) => {
  const { locale } = await params;
  
  return (
    // <AuthGuard>
    <div className="bg-white dark:bg-gray-950">


      <div className="px-[12px] lg:px-[100px] min-h-[750px] h-screen w-screen max-w-[1280px] mx-auto flex flex-col">
        <Link href={`/${locale}`} className=" pt-8">
          <Image
            src={ICONS.logo.main}
            width={156}
            height={49}
            alt="logo"
          />
        </Link>
        <main className="flex justify-center items-center relative gap-10 flex-1">
          {children}
          <div className="w-full sm:w-1/2 lg:block max-w-[530px] max-h-[603px] hidden h-full sm:h-auto">
            <Image
              src="https://dev-buyorsell.s3.me-central-1.amazonaws.com/assets/auth-banner.jpg"
              alt="Auth Banner"
              width={530}
              height={603}
              className="w-full h-full object-cover"
            />
          </div>
        </main>
      </div>
    </div>
    // </AuthGuard>

  );
};

export default AuthRootLayout;

