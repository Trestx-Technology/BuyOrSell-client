import React from "react";
import Image from "next/image";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication - BuyOrSell",
  description: "Authentication forms built using the components.",
};

const AuthRootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <GoogleOAuthProvider clientId={process.env.GOOGLE_CLIENT_ID!}>
      <div className="px-[12px] lg:px-[100px] min-h-[750px] h-screen w-screen max-w-[1280px] mx-auto flex flex-col">
        <div className=" pt-8">
          <Image
            src={
              "https://dev-buyorsell.s3.me-central-1.amazonaws.com/assets/logo.svg"
            }
            width={156}
            height={49}
            alt="logo"
          />
        </div>
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
    </GoogleOAuthProvider>
  );
};

export default AuthRootLayout;
