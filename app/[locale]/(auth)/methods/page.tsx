"use client";
import { H1, H5, } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";
import { useLocale } from "@/hooks/useLocale";

const Login = () => {
  const router = useRouter();
  const { localePath, t } = useLocale();

  return (
    <section className="w-full lg:w-1/2 max-w-[530px] h-full flex flex-col justify-center relative space-y-8">
      <H1
        className="text-center lg:text-left text-xl min-[500px]:text-3xl font-extrabold"
      >
        {t.auth.methods.title} <span className="text-purple">{t.auth.methods.subtitle}</span>
      </H1>
      <div className="space-y-3 text-sm sm:text-md font-medium">
        <Button
          variant={"ghost"}
          size={"lg"}
          className="w-full bg-white border-[#8B31E18A] border text-dark-blue"
          iconPosition="center"
          icon={<FcGoogle />}
        >
          {t.auth.methods.continueWithGoogle}
        </Button>

        <Button
          variant={"ghost"}
          size={"lg"}
          className="w-full bg-white border-[#8B31E18A] border text-dark-blue"
          iconPosition="center"
          onClick={() => router.push(localePath("/login"))}
          icon={
            <Image
              width={24}
              height={24}
              src={
                "https://dev-buyorsell.s3.me-central-1.amazonaws.com/icons/gmail.svg"
              }
              alt="gmail"
            />
          }
        >
  {t.auth.methods.continueWithEmail}
        </Button>
        <Button
          variant={"ghost"}
          size={"lg"}
          className="w-full bg-white border-[#8B31E18A] border text-dark-blue"
          iconPosition="center"
          icon={<FaApple />}
        >
{t.auth.methods.continueWithApple}
        </Button>

        <H5 className="text-center text-sm py-4">
{t.auth.methods.or}
        </H5>
      </div>
      <H5
        className="text-center text-sm absolute left-1/2 -translate-x-1/2  bottom-16 w-full"
      >
{t.auth.methods.dontHaveAccount}{" "}
        <Link href={localePath("/signup")} className="text-purple m-custom-16">
          {t.auth.methods.signUp}
        </Link>
      </H5>
    </section>
  );
};

export default Login;
