import React from "react";
import AuthBanner from "@/public/assets/auth-banner.jpg";
import logo from "@/public/assets/logo.svg";
import Image from "next/image";
import { GoogleOAuthProvider } from "@react-oauth/google";

const AuthRootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <GoogleOAuthProvider clientId={process.env.GOOGLE_CLIENT_ID!}>
      <div className="px-[12px] lg:px-[100px] min-h-[750px] h-screen w-screen max-w-[1280px] mx-auto flex flex-col">
        <div className=" pt-8">
          <Image src={logo} alt="logo" />
        </div>
        <main className="flex justify-center items-center relative gap-10 flex-1">
          {children}
          <div className="w-full sm:w-1/2 lg:block max-w-[530px] max-h-[603px] hidden h-full sm:h-auto">
            <Image
              src={AuthBanner}
              alt="Auth Banner"
              className="w-full h-full object-cover"
            />
          </div>
        </main>
      </div>
    </GoogleOAuthProvider>
  );
};

export default AuthRootLayout;
