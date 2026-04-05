"use client";

import React from "react";
import { motion } from "framer-motion";
import { Typography } from "@/components/typography";
import { cn } from "@/lib/utils";
import QRCode from "react-qr-code";
import {
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  AtSign,
  ArrowUp,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import { AppStoreButtons } from "./app-store-buttons";
import {
  fastContainerVariants,
  fastItemVariants,
} from "@/utils/animation-variants";
import { useEmirates } from "@/hooks/useLocations";
import { Emirate } from "@/interfaces/location.types";
import { HomeCategory } from "@/interfaces/home.types";
import { useGetMainCategories } from "@/hooks/useCategories";
import { Skeleton } from "../ui/skeleton";
import { ShareDialog } from "../ui/share-dialog";
import { slugify } from "@/utils/slug-utils";
import { ICONS } from "@/constants/icons";
import { PAGES_WITHOUT_NAV, shouldShowComponent } from "@/constants/layout.constants";
import { useLocale } from "@/hooks/useLocale";
import { useEmirateStore } from "@/stores/emirateStore";
import { useUrlParams } from "@/hooks/useUrlParams";

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  const { data: categories, isLoading: categoriesLoading } =
    useGetMainCategories();
  const { data: emirates, isLoading: emiratesLoading } = useEmirates();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const isMobileView = type === "mobile";
  const { t, locale, localePath } = useLocale();
  const isRTL = locale === "ar";
  const setSelectedEmirate = useEmirateStore(state => state.setSelectedEmirate);
  const { updateUrlParam } = useUrlParams();

  const shouldHideFooter = React.useMemo(() => {
    return isMobileView || shouldShowComponent(pathname || "", PAGES_WITHOUT_NAV);
  }, [pathname, isMobileView]);



  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (shouldHideFooter || pathname.includes("/coming-soon")) return null;

  return (
    <footer
      className={cn(
        "w-full bg-purple dark:bg-[#0B0F19] text-primary-foreground",
        className,
      )}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <motion.div
        className="w-full bg-black dark:bg-[#080B14]"
        initial="hidden"
        whileInView="visible"
      >
        <div className="max-w-[1280px] mx-auto px-5 lg:px-[100px] py-4">
          <button
            onClick={scrollToTop}
            className="flex items-center justify-center w-full py-4 text-white hover:text-gray-200 transition-all duration-200 hover:scale-105 cursor-pointer group"
          >
            <Typography variant="body" className="font-medium text-sm">
              {t.home.navbar.backToTop}
            </Typography>
            <ArrowUp className={cn("w-4 h-4 transition-transform duration-200 group-hover:-translate-y-1", isRTL ? "mr-2" : "ml-2")} />
          </button>
        </div>
      </motion.div>
      {/* Main Footer Content */}
      <motion.div
        className="max-w-[1280px] mx-auto px-5 lg:px-[100px] py-12"
        variants={fastContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.div
          className="mb-8 rounded-lg w-fit mx-auto md:mx-0 bg-white p-2"
          variants={fastItemVariants}
        >
          <Link href={localePath("/")}>
            <Image
              src={ICONS.logo.full}
              alt="logo"
              width={150}
              height={50}
              className="w-[180px] object-contain dark:brightness-200 contrast-125"
            />
          </Link>
        </motion.div>

        {/* Footer Links Grid */}
        <div className="w-full md:grid md:grid-cols-4 lg:flex items-start justify-between mb-8">

          {/* UAE Section */}
          <motion.div
            className="space-y-6 hidden md:block"
            variants={fastItemVariants}
          >
            <Typography variant="h6" className="font-medium text-sm text-white text-start">
              {t.home.navbar.uae}
            </Typography>
            <div className="space-y-3 text-start">
              {emiratesLoading
                ? // Skeleton for emirates
                  Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton key={i} className="h-6 w-30 rounded" />
                  ))
                : (emirates || [])
                    .slice(0, 8)
                    .map((emirateObj: Emirate, idx: number) => (
                      <button
                        key={idx}
                        type="button"
                        className="block w-full text-start bg-transparent border-none p-0 cursor-pointer"
                        onClick={() => {
                          setSelectedEmirate(emirateObj.emirate);
                          updateUrlParam("emirate", emirateObj.emirate);
                        }}
                        aria-label={`Select ${emirateObj.emirate}`}
                      >
                        <Typography
                          variant="body"
                          className="text-sm opacity-80 hover:opacity-100 hover:text-white dark:text-gray-400 dark:hover:text-white cursor-pointer transition-all duration-200"
                        >
                          {isRTL ? emirateObj.emirateAr : emirateObj.emirate}
                        </Typography>
                      </button>
                    ))}
            </div>
          </motion.div>

          {/* Categories Section */}
          <motion.div
            className="space-y-6 hidden md:block"
            variants={fastItemVariants}
          >
            <Typography variant="h6" className="font-medium text-sm text-white text-start">
              {t.home.navbar.categories}
            </Typography>
            <div className="space-y-3 text-start">
              {categoriesLoading
                ? // Skeleton for categories
                  Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton key={i} className="h-6 w-30 rounded" />
                  ))
                : categories?.map((cat, idx: number) => (
                    <Link
                      href={localePath(`/${slugify(cat.name)}`)}
                      key={idx}
                      className="block"
                    >
                      <Typography
                        variant="body"
                        className="text-sm opacity-80 hover:opacity-100 hover:text-white dark:text-gray-400 dark:hover:text-white cursor-pointer transition-all duration-200"
                      >
                        {isRTL ? cat.nameAr || cat.name : cat.name}
                      </Typography>
                    </Link>
                  ))}
            </div>
          </motion.div>

          {/* Download App Section */}
          <motion.div
            className="space-y-6 flex flex-col justify-center items-center w-full md:w-auto lg:items-start"
            variants={fastItemVariants}
          >
            <Typography variant="h6" className={cn("font-medium text-sm text-white", isRTL ? "text-start lg:text-start" : "text-center lg:text-start")}>
              {t.home.navbar.downloadApp}
            </Typography>
            <div className="space-y-4">
              <Typography
                variant="body"
                className="text-sm opacity-70 hidden lg:block text-white"
              >
                {t.home.navbar.newUserOnly}
              </Typography>
              <div className="flex flex-col lg:flex-row items-center gap-2">
                {/* QR Code */}
                <div className="size-20 bg-black rounded border-2 border-white flex items-center justify-center">
                  <QRCode
                    value={"https://buyorsell.com"}
                    size={180}
                    bgColor="#ffffff"
                    fgColor="#000000"
                    aria-label={isRTL ? "امسح رمز الاستجابة السريعة لتحميل التطبيق" : "Scan QR code to download the app"}
                  />
                </div>
                {/* App Store Buttons */}
                <AppStoreButtons className="lg:flex-col" />
              </div>
            </div>
          </motion.div>

          {/* Subscribe Section */}
          <motion.div
            className="space-y-6 hidden md:block"
            variants={fastItemVariants}
          >
            <Typography variant="h6" className="font-medium text-sm text-white text-start">
              {t.home.navbar.subscribe}
            </Typography>
            <div className="space-y-3 flex flex-col text-start">
              <Link href={localePath("/help-centre")} className="block">
                <Typography
                  variant="body"
                  className="text-sm opacity-80 hover:opacity-100 hover:text-white dark:text-gray-400 dark:hover:text-white cursor-pointer transition-all duration-200"
                >
                  {t.home.navbar.help}
                </Typography>
              </Link>
              <Link href={localePath("/blog")} className="block">
                <Typography
                  variant="body"
                  className="text-sm opacity-80 hover:opacity-100 hover:text-white dark:text-gray-400 dark:hover:text-white cursor-pointer transition-all duration-200"
                >
                  {t.home.navbar.blog}
                </Typography>
              </Link>
              <Link href={localePath("/contact-us")} className="block">
                <Typography
                  variant="body"
                  className="text-sm opacity-80 hover:opacity-100 hover:text-white dark:text-gray-400 dark:hover:text-white cursor-pointer transition-all duration-200"
                >
                  {t.home.navbar.contactUs}
                </Typography>
              </Link>
              <Link href={localePath("/rate-us")} className="block">
                <Typography
                  variant="body"
                  className="text-sm opacity-80 hover:opacity-100 hover:text-white dark:text-gray-400 dark:hover:text-white cursor-pointer transition-colors duration-200"
                >
                  {t.home.navbar.rateUs}
                </Typography>
              </Link>
              <ShareDialog title={isRTL ? "مشاركة" : "Share"} url={"https://buyorsell.ae"}>
                <Typography
                  variant="body"
                  className="text-sm opacity-80 hover:opacity-100 hover:text-white dark:text-gray-400 dark:hover:text-white cursor-pointer transition-all duration-200"
                >
                  {t.home.navbar.shareWithFriend.split(" ")[0]}
                </Typography>
              </ShareDialog>
            </div>
          </motion.div>

          {/* Language Section */}
          <motion.div
            className="space-y-6 hidden md:block"
            variants={fastItemVariants}
          >
            <Typography variant="h6" className="font-medium text-sm text-white text-start">
              {t.home.navbar.language}
            </Typography>
            <div className="space-y-3 flex flex-col text-start ">
              <Link
                href="/en"
                className="text-sm opacity-80 hover:opacity-100 hover:text-white dark:text-gray-400 dark:hover:text-white cursor-pointer transition-all duration-200"
              >
                English
              </Link>
              <Link
                href="/ar"
                className="text-sm opacity-80 hover:opacity-100 hover:text-white dark:text-gray-400 dark:hover:text-white cursor-pointer transition-all duration-200"
              >
                {isRTL ? "العربية" : "Arabic"}
              </Link>
            </div>
          </motion.div>


        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/20 dark:bg-gray-800 mb-8 hidden md:block"></div>

        {/* Bottom Section */}
        <motion.div
          className="flex justify-center md:justify-between flex-wrap gap-5 items-center"
          variants={fastItemVariants}
        >
          {/* Left Side - Legal Links */}
          <div className="hidden md:flex items-center gap-6 ">
            <Link href={localePath("/privacy-policy")}>
              <Typography
                variant="body"
                className="text-sm opacity-80 hover:opacity-100 hover:text-white dark:text-gray-400 dark:hover:text-white cursor-pointer transition-all duration-200"
              >
                {t.home.navbar.privacyPolicy}
              </Typography>
            </Link>
            <Link href={localePath("/terms-and-conditions")}>
              <Typography
                variant="body"
                className="text-sm opacity-80 hover:opacity-100 hover:text-white dark:text-gray-400 dark:hover:text-white cursor-pointer transition-all duration-200"
              >
                {t.home.navbar.termsConditions}
              </Typography>
            </Link>
            <Typography variant="body" className={cn("text-sm opacity-60", isRTL ? "mr-4" : "ml-4")}>
              © 2024 buyOrsell | {t.home.navbar.allRightsReserved}
            </Typography>
          </div>

          {/* Right Side - Social Media */}
          <div className="flex items-center gap-5">
            {/* Instagram */}
            <Link
              href="https://www.instagram.com/buyorsell.official/?igsh=MWRqbDJsdmE0bHNlbg%3D%3D&utm_source=qr"
              target="_blank"
              className="w-[38px] h-[38px] bg-white dark:bg-gray-800 rounded-full border border-white dark:border-gray-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-all duration-200 hover:scale-110"
            >
              <Instagram className="w-6 h-6 text-purple dark:text-white" />
            </Link>

            {/* Facebook */}
            <Link
              href="https://www.facebook.com/share/1BCKaPabad/?mibextid=wwXIfr"
              target="_blank"
              className="w-[38px] h-[38px] bg-white dark:bg-gray-800 rounded-full border border-white dark:border-gray-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-all duration-200 hover:scale-110"
            >
              <Facebook className="w-6 h-6 text-purple dark:text-white" />
            </Link>

            {/* YouTube - Commented out as requested */}
            {/* <div className="w-[38px] h-[38px] bg-white dark:bg-gray-800 rounded-full border border-white dark:border-gray-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-all duration-200 hover:scale-110">
              <Youtube className="w-6 h-6 text-purple dark:text-white" />
            </div> */}

            {/* Threads (Replacing Twitter) */}
            <Link
              href="https://www.threads.com/@buyorsell.official?invite=0"
              target="_blank"
              className="w-[38px] h-[38px] bg-white dark:bg-gray-800 rounded-full border border-white dark:border-gray-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-all duration-200 hover:scale-110"
            >
              <AtSign className="w-4 h-4 text-purple dark:text-white" />
            </Link>

            {/* LinkedIn */}
            <Link
              href="https://www.linkedin.com/company/buyorsellofficial/"
              target="_blank"
              className="w-[38px] h-[38px] bg-white dark:bg-gray-800 rounded-full border border-white dark:border-gray-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-all duration-200 hover:scale-110"
            >
              <Linkedin className="w-6 h-6 text-purple dark:text-white" />
            </Link>
          </div>
        </motion.div>
        <div className="w-full h-px bg-white mt-8 md:hidden"></div>
      </motion.div>

      {/* Back to Top Button */}
    </footer>
  );
}
