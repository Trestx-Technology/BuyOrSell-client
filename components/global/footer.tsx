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
  ArrowUp,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
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

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  const { data: categories, isLoading: categoriesLoading } = useGetMainCategories();
  const { data: emirates, isLoading: emiratesLoading } = useEmirates();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      className={cn("w-full bg-purple dark:bg-[#0B0F19] text-primary-foreground", className)}
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
              Back to top
            </Typography>
            <ArrowUp className="ml-2 w-4 h-4 transition-transform duration-200 group-hover:-translate-y-1" />
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
          className="mb-8 rounded-lg w-fit mx-auto md:mx-0"
          variants={fastItemVariants}
        >
          <Link href="/">
            <Image
              src={ICONS.logo.main}
              alt="logo"
              width={150}
              height={50}
              className="w-[180px] object-contain dark:brightness-200 contrast-125"
            />
          </Link>
        </motion.div>

        {/* Footer Links Grid */}
        <div className="w-full md:grid md:grid-cols-4 lg:flex items-start justify-between mb-8">
          {/* Company Section */}
          <motion.div
            className="space-y-6 hidden md:block"
            variants={fastItemVariants}
          >
            <Typography variant="h6" className="font-medium text-sm text-white">
              Company
            </Typography>
            <div className="space-y-3">
              <Typography
                variant="body"
                className="text-sm opacity-80 hover:opacity-100 hover:text-white dark:text-gray-400 dark:hover:text-white cursor-pointer transition-all duration-200"
              >
                About Us
              </Typography>
              <Typography
                variant="body"
                className="text-sm opacity-80 hover:opacity-100 hover:text-white dark:text-gray-400 dark:hover:text-white cursor-pointer transition-all duration-200"
              >
                Advertising
              </Typography>
              <Typography
                variant="body"
                className="text-sm opacity-80 hover:opacity-100 hover:text-white dark:text-gray-400 dark:hover:text-white cursor-pointer transition-all duration-200"
              >
                Careers
              </Typography>
              <Typography
                variant="body"
                className="text-sm opacity-80 hover:opacity-100 hover:text-white dark:text-gray-400 dark:hover:text-white cursor-pointer transition-all duration-200"
              >
                Legal Help
              </Typography>
            </div>
          </motion.div>

          {/* UAE Section */}
          <motion.div
            className="space-y-6 hidden md:block"
            variants={fastItemVariants}
          >
            <Typography variant="h6" className="font-medium text-sm text-white">
              UAE
            </Typography>
            <div className="space-y-3">
              {emiratesLoading ? (
                // Skeleton for emirates
                Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-6 w-30 rounded" />
                ))
              ) : (
                (emirates || []).slice(0, 8).map((emirateObj: Emirate, idx: number) => (
                  <Link
                    href={`/categories/${slugify(categories?.[idx]?.name)}?location=${emirateObj.emirate}`}
                    key={idx}
                    className="block"
                  >
                    <Typography
                      variant="body"
                      className="text-sm opacity-80 hover:opacity-100 hover:text-white dark:text-gray-400 dark:hover:text-white cursor-pointer transition-all duration-200"
                    >
                      {emirateObj.emirate}
                    </Typography>
                  </Link>
                ))
              )}
            </div>
          </motion.div>

          {/* Categories Section */}
          <motion.div
            className="space-y-6 hidden md:block"
            variants={fastItemVariants}
          >
            <Typography variant="h6" className="font-medium text-sm text-white">
              Categories
            </Typography>
            <div className="space-y-3">
              {categoriesLoading ? (
                // Skeleton for categories
                Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-6 w-30 rounded" />
                ))
              ) : (
                categories?.map((cat, idx: number) => (
                  <Link
                    href={`/categories/${slugify(cat.name)}`}
                    key={idx}
                    className="block"
                  >
                    <Typography
                      variant="body"
                      className="text-sm opacity-80 hover:opacity-100 hover:text-white dark:text-gray-400 dark:hover:text-white cursor-pointer transition-all duration-200"
                    >
                      {cat.name}
                    </Typography>
                  </Link>
                ))
              )}
            </div>
          </motion.div>

          {/* Download App Section */}
          <motion.div
            className="space-y-6 flex flex-col justify-center items-center w-full md:w-auto lg:items-start"
            variants={fastItemVariants}
          >
            <Typography variant="h6" className="font-medium text-sm text-white">
              Download App
            </Typography>
            <div className="space-y-4">
              <Typography
                variant="body"
                className="text-sm opacity-70 hidden lg:block text-white"
              >
                New User Only
              </Typography>
              <div className="flex flex-col lg:flex-row items-center gap-2">
                {/* QR Code */}
                <div className="size-20 bg-black rounded border-2 border-white flex items-center justify-center">
                  <QRCode
                    value={"https://buyorsell.com"}
                    size={180}
                    bgColor="#ffffff"
                    fgColor="#000000"
                    aria-label="Scan QR code to download the app"
                  />
                </div>
                {/* App Store Buttons */}
                <div className="space-y-1 w-full flex md:flex-col gap-3 md:gap-0">
                  {/* Google Play Button */}
                  <Button
                    icon={
                      <Image
                        src="https://firebasestorage.googleapis.com/v0/b/dealdome-12a90.firebasestorage.app/o/icons%2FGroup.svg?alt=media&token=08d8b0d5-e352-4d63-9ead-4824478c6065"
                        alt="google play"
                        width={25}
                        height={25}
                        className="size-[20px] sm:size-[25px]"
                      />
                    }
                    iconPosition="left"
                    onClick={() =>
                      window.open(
                        "https://play.google.com/store/apps/details?id=com.yourpackage",
                        "_blank"
                      )
                    }
                    className="bg-black px-3 md:px-6 font-medium text-white hover:bg-black/70 h-12 text-left capitalize"
                  >
                    <span className="flex flex-col gap-0 justify-start relative songMyung pt-2 text-sm sm:text-md">
                      <span className="text-[8px] sm:text-[10px] tracking-wider absolute top-[-5px] font-inter">
                        GET IT ON
                      </span>
                      Google play
                    </span>
                  </Button>

                  {/* App Store Button */}
                  <Button
                    icon={
                      <Image
                        src="https://firebasestorage.googleapis.com/v0/b/dealdome-12a90.firebasestorage.app/o/icons%2FGroup%20(1).svg?alt=media&token=697b0ca8-67bf-44d9-bc5d-ee12e36822a7"
                        alt="google play"
                        width={25}
                        height={25}
                        className="size-[20px] sm:size-[25px]"
                      />
                    }
                    iconPosition="left"
                    onClick={() =>
                      window.open(
                        `https://apps.apple.com/app/idXXXXXXXXX`,
                        "_blank"
                      )
                    }
                    className="bg-black px-3  font-medium text-white hover:bg-black/70 h-12 text-left capitalize"
                  >
                    <span className="flex flex-col gap-0 justify-start relative songMyung pt-2 text-sm sm:text-md">
                      <span className="text-[8px] sm:text-[10px] tracking-wider absolute top-[-5px] font-inter">
                        Available on the
                      </span>
                      App Store
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Subscribe Section */}
          <motion.div
            className="space-y-6 hidden md:block"
            variants={fastItemVariants}
          >
            <Typography variant="h6" className="font-medium text-sm text-white">
              Subscribe
            </Typography>
            <div className="space-y-3 flex flex-col">
              <Link href="/help-centre" className="block">
                <Typography
                  variant="body"
                  className="text-sm opacity-80 hover:opacity-100 hover:text-white dark:text-gray-400 dark:hover:text-white cursor-pointer transition-all duration-200"
                >
                  Help
                </Typography>
              </Link>
              <Link href="/contact-us" className="block">
                <Typography
                  variant="body"
                  className="text-sm opacity-80 hover:opacity-100 hover:text-white dark:text-gray-400 dark:hover:text-white cursor-pointer transition-all duration-200"
                >
                  Contact Us
                </Typography>
              </Link>
              <Link href="/contact-us" className="block">
                <Typography
                  variant="body"
                  className="text-sm opacity-80 hover:opacity-100 hover:text-white dark:text-gray-400 dark:hover:text-white cursor-pointer transition-all duration-200"
                >
                  Call Us
                </Typography>
              </Link>
              <Link href="/rate-us" className="block">
                <Typography
                  variant="body"
                  className="text-sm opacity-80 hover:opacity-100 hover:text-white dark:text-gray-400 dark:hover:text-white cursor-pointer transition-colors duration-200"
                >
                  Rate Us
              </Typography>
              </Link>
              <ShareDialog title="Share" url={"https://buyorsell.ae"}>
                <Typography
                  variant="body"
                  className="text-sm opacity-80 hover:opacity-100 hover:text-white dark:text-gray-400 dark:hover:text-white cursor-pointer transition-all duration-200"
                >
                  Share
                </Typography>
              </ShareDialog>
            </div>
          </motion.div>

          {/* Language Section */}
          <motion.div
            className="space-y-6 hidden md:block"
            variants={fastItemVariants}
          >
            <Typography variant="h6" className="font-medium text-sm text-white">
              Language
            </Typography>
            <div className="space-y-3 flex flex-col">
              <Link
                href="/en-US"
                className="text-sm opacity-80 hover:opacity-100 hover:text-white dark:text-gray-400 dark:hover:text-white cursor-pointer transition-all duration-200"
              >
                English
              </Link>
              <Link
                href="/ar"
                className="text-sm opacity-80 hover:opacity-100 hover:text-white dark:text-gray-400 dark:hover:text-white cursor-pointer transition-all duration-200"
              >
                Arabic
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
            <Link href="/privacy-policy">
              <Typography
                variant="body"
                className="text-sm opacity-80 hover:opacity-100 hover:text-white dark:text-gray-400 dark:hover:text-white cursor-pointer transition-all duration-200"
              >
                Privacy & Policy
              </Typography>
            </Link>
            <Link href="/terms-and-conditions">
              <Typography
                variant="body"
                className="text-sm opacity-80 hover:opacity-100 hover:text-white dark:text-gray-400 dark:hover:text-white cursor-pointer transition-all duration-200"
              >
                Terms & Conditions
              </Typography>
            </Link>
            <Typography variant="body" className="text-sm opacity-60">
              © 2024 BuyOrSell | All Rights Reserved
            </Typography>
          </div>

          {/* Right Side - Social Media */}
          <div className="flex items-center gap-5">
            {/* Instagram */}
            <div className="w-[38px] h-[38px] bg-white dark:bg-gray-800 rounded-full border border-white dark:border-gray-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-all duration-200 hover:scale-110">
              <Instagram className="w-6 h-6 text-purple dark:text-white" />
            </div>

            {/* Facebook */}
            <div className="w-[38px] h-[38px] bg-white dark:bg-gray-800 rounded-full border border-white dark:border-gray-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-all duration-200 hover:scale-110">
              <Facebook className="w-6 h-6 text-purple dark:text-white" />
            </div>

            {/* YouTube */}
            <div className="w-[38px] h-[38px] bg-white dark:bg-gray-800 rounded-full border border-white dark:border-gray-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-all duration-200 hover:scale-110">
              <Youtube className="w-6 h-6 text-purple dark:text-white" />
            </div>

            {/* Twitter */}
            <div className="w-[38px] h-[38px] bg-white dark:bg-gray-800 rounded-full border border-white dark:border-gray-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-all duration-200 hover:scale-110">
              <Twitter className="w-4 h-4 text-purple dark:text-white" />
            </div>

            {/* LinkedIn */}
            <div className="w-[38px] h-[38px] bg-white dark:bg-gray-800 rounded-full border border-white dark:border-gray-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-all duration-200 hover:scale-110">
              <Linkedin className="w-6 h-6 text-purple dark:text-white" />
            </div>
          </div>
        </motion.div>
        <div className="w-full h-px bg-white mt-8 md:hidden"></div>
      </motion.div>

      {/* Back to Top Button */}
    </footer>
  );
}
