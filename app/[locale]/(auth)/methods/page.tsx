"use client";
import { H1, H5 } from "@/components/typography";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { FirebaseAuthButtons } from "../_components/firebase-auth-buttons";
import { useRouter } from "nextjs-toploader/app";
import { useLocale } from "@/hooks/useLocale";
import { MailIcon } from "lucide-react";

const Login = () => {
  const router = useRouter();
  const { localePath, t } = useLocale();

  return (
    <section className="w-full lg:w-1/2 max-w-[530px] h-full flex flex-col justify-center relative space-y-8">
      <H1 className="text-center lg:text-left text-xl min-[500px]:text-3xl font-extrabold text-black dark:text-white">
        {t.auth.methods.title}{" "}
        <span className="text-purple">{t.auth.methods.subtitle}</span>
      </H1>
      <div className="space-y-3 text-sm sm:text-md font-medium">
        <Button
          variant={"ghost"}
          size={"small"}
          className="w-full h-12 bg-white border text-dark-blue border-purple/10 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
          iconPosition="center"
          onClick={() => router.push(localePath("/login"))}
          icon={<MailIcon className="w-5 h-5 text-blue-500" strokeWidth={2} />}
        >
          {t.auth.methods.continueWithEmail}
        </Button>
        <FirebaseAuthButtons
          onSuccess={async (data) => {
            router.push(localePath("/"));
          }}
          onError={(error) => console.error(error)}
          btnClassName="border border-purple/10 dark:border-gray-700"
        />
      </div>
      <H5 className="text-center text-sm w-full text-gray-600 dark:text-gray-400">
        {t.auth.methods.dontHaveAccount}{" "}
        <Link href={localePath("/signup")} className="text-purple  ">
          {t.auth.methods.signUp}
        </Link>
      </H5>
    </section>
  );
};

export default Login;
