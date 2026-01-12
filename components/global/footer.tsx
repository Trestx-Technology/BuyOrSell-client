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
import { Button } from "../ui/button";
import {
  fastContainerVariants,
  fastItemVariants,
} from "@/utils/animation-variants";

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      className={cn("w-full bg-purple text-primary-foreground", className)}
    >
      <motion.div
        className="w-full bg-black"
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
        {/* Logo Section */}
        <motion.div
          className="mb-8 bg-white rounded-lg p-4 w-fit mx-auto md:mx-0"
          variants={fastItemVariants}
        >
          <Image
            src="https://dev-buyorsell.s3.me-central-1.amazonaws.com/assets/logo.svg"
            alt="logo"
            width={100}
            height={100}
            className="w-[150px] object-contain"
          />
        </motion.div>

        {/* Footer Links Grid */}
        <div className="w-full md:grid md:grid-cols-4 lg:flex items-start justify-between mb-8">
          {/* Company Section */}
          <motion.div
            className="space-y-6 hidden md:block"
            variants={fastItemVariants}
          >
            <Typography variant="h6" className="font-medium text-sm">
              Company
            </Typography>
            <div className="space-y-3">
              <Typography
                variant="body"
                className="text-sm hover:text-gray-200 cursor-pointer transition-colors duration-200"
              >
                About Us
              </Typography>
              <Typography
                variant="body"
                className="text-sm hover:text-gray-200 cursor-pointer transition-colors duration-200"
              >
                Advertising
              </Typography>
              <Typography
                variant="body"
                className="text-sm hover:text-gray-200 cursor-pointer transition-colors duration-200"
              >
                Careers
              </Typography>
              <Typography
                variant="body"
                className="text-sm hover:text-gray-200 cursor-pointer transition-colors duration-200"
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
            <Typography variant="h6" className="font-medium text-sm">
              UAE
            </Typography>
            <div className="space-y-3">
              <Typography
                variant="body"
                className="text-sm hover:text-gray-200 cursor-pointer transition-colors duration-200"
              >
                Dubai
              </Typography>
              <Typography
                variant="body"
                className="text-sm hover:text-gray-200 cursor-pointer transition-colors duration-200"
              >
                Abu Dhabi
              </Typography>
              <Typography
                variant="body"
                className="text-sm hover:text-gray-200 cursor-pointer transition-colors duration-200"
              >
                Ras Al Khaimah
              </Typography>
              <Typography
                variant="body"
                className="text-sm hover:text-gray-200 cursor-pointer transition-colors duration-200"
              >
                Sharjah
              </Typography>
              <Typography
                variant="body"
                className="text-sm hover:text-gray-200 cursor-pointer transition-colors duration-200"
              >
                Fujairah
              </Typography>
              <Typography
                variant="body"
                className="text-sm hover:text-gray-200 cursor-pointer transition-colors duration-200"
              >
                Ajman
              </Typography>
              <Typography
                variant="body"
                className="text-sm hover:text-gray-200 cursor-pointer transition-colors duration-200"
              >
                Umm Al Quwain
              </Typography>
              <Typography
                variant="body"
                className="text-sm hover:text-gray-200 cursor-pointer transition-colors duration-200"
              >
                Al Ain
              </Typography>
            </div>
          </motion.div>

          {/* Categories Section */}
          <motion.div
            className="space-y-6 hidden md:block"
            variants={fastItemVariants}
          >
            <Typography variant="h6" className="font-medium text-sm">
              Categories
            </Typography>
            <div className="space-y-3">
              <Typography
                variant="body"
                className="text-sm hover:text-gray-200 cursor-pointer transition-colors duration-200"
              >
                Motors
              </Typography>
              <Typography
                variant="body"
                className="text-sm hover:text-gray-200 cursor-pointer transition-colors duration-200"
              >
                Property
              </Typography>
              <Typography
                variant="body"
                className="text-sm hover:text-gray-200 cursor-pointer transition-colors duration-200"
              >
                Classifieds
              </Typography>
              <Typography
                variant="body"
                className="text-sm hover:text-gray-200 cursor-pointer transition-colors duration-200"
              >
                Furniture
              </Typography>
              <Typography
                variant="body"
                className="text-sm hover:text-gray-200 cursor-pointer transition-colors duration-200"
              >
                Electronics
              </Typography>
              <Typography
                variant="body"
                className="text-sm hover:text-gray-200 cursor-pointer transition-colors duration-200"
              >
                Jobs
              </Typography>
              <Typography
                variant="body"
                className="text-sm hover:text-gray-200 cursor-pointer transition-colors duration-200"
              >
                Community
              </Typography>
              <Typography
                variant="body"
                className="text-sm hover:text-gray-200 cursor-pointer transition-colors duration-200"
              >
                Others
              </Typography>
            </div>
          </motion.div>

          {/* Download App Section */}
          <motion.div
            className="space-y-6 flex flex-col justify-center items-center w-full md:w-auto lg:items-start"
            variants={fastItemVariants}
          >
            <Typography variant="h6" className="font-medium text-sm">
              Download App
            </Typography>
            <div className="space-y-4">
              <Typography
                variant="body"
                className="text-sm opacity-70 hidden lg:block"
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
            <Typography variant="h6" className="font-medium text-sm">
              Subscribe
            </Typography>
            <div className="space-y-3">
              <Typography
                variant="body"
                className="text-sm hover:text-gray-200 cursor-pointer transition-colors duration-200"
              >
                Help
              </Typography>
              <Typography
                variant="body"
                className="text-sm hover:text-gray-200 cursor-pointer transition-colors duration-200"
              >
                Contact Us
              </Typography>
              <Typography
                variant="body"
                className="text-sm hover:text-gray-200 cursor-pointer transition-colors duration-200"
              >
                Call Us
              </Typography>
              <Typography
                variant="body"
                className="text-sm hover:text-gray-200 cursor-pointer transition-colors duration-200"
              >
                Rate Us
              </Typography>
              <Typography
                variant="body"
                className="text-sm hover:text-gray-200 cursor-pointer transition-colors duration-200"
              >
                Share
              </Typography>
            </div>
          </motion.div>

          {/* Language Section */}
          <motion.div
            className="space-y-6 hidden md:block"
            variants={fastItemVariants}
          >
            <Typography variant="h6" className="font-medium text-sm">
              Language
            </Typography>
            <div className="space-y-3">
              <Typography
                variant="body"
                className="text-sm hover:text-gray-200 cursor-pointer transition-colors duration-200"
              >
                English
              </Typography>
              <Typography
                variant="body"
                className="text-sm hover:text-gray-200 cursor-pointer transition-colors duration-200"
              >
                Arabic
              </Typography>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white mb-8 hidden md:block"></div>

        {/* Bottom Section */}
        <motion.div
          className="flex justify-center md:justify-between flex-wrap gap-5 items-center"
          variants={fastItemVariants}
        >
          {/* Left Side - Legal Links */}
          <div className="hidden md:flex items-center gap-6 ">
            <Typography
              variant="body"
              className="text-sm hover:text-gray-200 cursor-pointer transition-colors duration-200"
            >
              Privacy & Policy
            </Typography>
            <Typography
              variant="body"
              className="text-sm hover:text-gray-200 cursor-pointer transition-colors duration-200"
            >
              Terms & Conditions
            </Typography>
            <Typography variant="body" className="text-sm">
              © 2024 BuyOrSell | All Rights Reserved
            </Typography>
          </div>

          {/* Right Side - Social Media */}
          <div className="flex items-center gap-5">
            {/* Instagram */}
            <div className="w-[38px] h-[38px] bg-white rounded-full border border-white flex items-center justify-center hover:bg-gray-100 cursor-pointer transition-all duration-200 hover:scale-110">
              <Instagram className="w-6 h-6 text-[#8B31E1]" />
            </div>

            {/* Facebook */}
            <div className="w-[38px] h-[38px] bg-white rounded-full border border-white flex items-center justify-center hover:bg-gray-100 cursor-pointer transition-all duration-200 hover:scale-110">
              <Facebook className="w-6 h-6 text-[#8B31E1]" />
            </div>

            {/* YouTube */}
            <div className="w-[38px] h-[38px] bg-white rounded-full border border-white flex items-center justify-center hover:bg-gray-100 cursor-pointer transition-all duration-200 hover:scale-110">
              <Youtube className="w-6 h-6 text-[#8B31E1]" />
            </div>

            {/* Twitter */}
            <div className="w-[38px] h-[38px] bg-white rounded-full border border-white flex items-center justify-center hover:bg-gray-100 cursor-pointer transition-all duration-200 hover:scale-110">
              <Twitter className="w-4 h-4 text-[#8B31E1]" />
            </div>

            {/* LinkedIn */}
            <div className="w-[38px] h-[38px] bg-white rounded-full border border-white flex items-center justify-center hover:bg-gray-100 cursor-pointer transition-all duration-200 hover:scale-110">
              <Linkedin className="w-6 h-6 text-[#8B31E1]" />
            </div>
          </div>
        </motion.div>
        <div className="w-full h-px bg-white mt-8 md:hidden"></div>
      </motion.div>

      {/* Back to Top Button */}
    </footer>
  );
}
