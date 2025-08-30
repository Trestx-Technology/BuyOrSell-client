import React from "react";
import logo from "@/public/assets/logo.svg";
import Image from "next/image";
import { GoogleOAuthProvider } from "@react-oauth/google";

const AuthRootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <GoogleOAuthProvider clientId={process.env.GOOGLE_CLIENT_ID!}>
      <div className="px-[12px] lg:px-[100px] min-h-[750px] h-screen w-screen max-w-[1280px] mx-auto flex flex-col">
        <div className=" pt-8">
          <Image
            src={
              "https://dev-buyorsell.s3.me-central-1.amazonaws.com/assets/logo.svg"
            }
            alt="logo"
          />
        </div>
        <main className="flex justify-center items-center relative gap-10 flex-1">
          {children}
          <div className="w-full sm:w-1/2 lg:block max-w-[530px] max-h-[603px] hidden h-full sm:h-auto">
            <Image
              src="https://images.unsplash.com/photo-1496247749665-49cf5b1022e9?q=80&w=1173&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
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
