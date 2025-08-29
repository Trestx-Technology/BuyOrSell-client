"use client";

import React from "react";
import { motion } from "framer-motion";
import { Typography } from "@/components/typography";
import { cn } from "@/lib/utils";
import {
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  ArrowUp,
} from "lucide-react";
import Image from "next/image";

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <footer className={cn("w-full bg-[#8B31E1] text-white", className)}>
      <motion.div
        className="w-full bg-black"
        variants={itemVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="max-w-[1280px] mx-auto px-[100px] py-4">
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
        className="max-w-[1280px] mx-auto px-[100px] py-12"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Logo Section */}
        <motion.div
          className="mb-8 bg-white rounded-lg p-4 w-fit"
          variants={itemVariants}
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
        <div className="grid grid-cols-6 gap-8 mb-8">
          {/* Company Section */}
          <motion.div className="space-y-6" variants={itemVariants}>
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
          <motion.div className="space-y-6" variants={itemVariants}>
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
          <motion.div className="space-y-6" variants={itemVariants}>
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
          <motion.div className="space-y-6" variants={itemVariants}>
            <Typography variant="h6" className="font-medium text-sm">
              Download App
            </Typography>
            <div className="space-y-4">
              <Typography variant="body" className="text-sm opacity-70">
                New User Only
              </Typography>
              <div className="flex items-center gap-2">
                {/* QR Code */}
                <div className="w-20 h-20 bg-black rounded border-2 border-white flex items-center justify-center">
                  <div className="w-16 h-16 bg-gray-300 rounded"></div>
                </div>
                {/* App Store Buttons */}
                <div className="space-y-1">
                  <div className="w-[110px] h-10 bg-black rounded border border-white flex items-center justify-center">
                    <Typography variant="body" className="text-white text-xs">
                      Google Play
                    </Typography>
                  </div>
                  <div className="w-[110px] h-10 bg-black rounded border border-white flex items-center justify-center">
                    <Typography variant="body" className="text-white text-xs">
                      App Store
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Subscribe Section */}
          <motion.div className="space-y-6" variants={itemVariants}>
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
          <motion.div className="space-y-6" variants={itemVariants}>
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
        <div className="w-full h-px bg-white mb-8"></div>

        {/* Bottom Section */}
        <motion.div
          className="flex justify-between items-center"
          variants={itemVariants}
        >
          {/* Left Side - Legal Links */}
          <div className="flex items-center gap-6">
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

            {/* TikTok */}
            <div className="w-[38px] h-[38px] bg-white rounded-full border border-white flex items-center justify-center hover:bg-gray-100 cursor-pointer transition-all duration-200 hover:scale-110">
              <div className="w-6 h-6 bg-[#8B31E1] rounded-sm"></div>
            </div>

            {/* Snapchat */}
            <div className="w-[38px] h-[38px] bg-white rounded-full border border-white flex items-center justify-center hover:bg-gray-100 cursor-pointer transition-all duration-200 hover:scale-110">
              <div className="w-6 h-6 bg-[#8B31E1] rounded-sm"></div>
            </div>

            {/* Google Plus */}
            <div className="w-[38px] h-[38px] bg-white rounded-full border border-white flex items-center justify-center hover:bg-gray-100 cursor-pointer transition-all duration-200 hover:scale-110">
              <div className="w-6 h-6 bg-[#8B31E1] rounded-sm"></div>
            </div>

            {/* YouTube */}
            <div className="w-[38px] h-[38px] bg-white rounded-full border border-white flex items-center justify-center hover:bg-gray-100 cursor-pointer transition-all duration-200 hover:scale-110">
              <Youtube className="w-6 h-6 text-[#8B31E1]" />
            </div>

            {/* Twitter */}
            <div className="w-[38px] h-[38px] bg-white rounded-full border border-white flex items-center justify-center hover:bg-gray-100 cursor-pointer transition-all duration-200 hover:scale-110">
              <Twitter className="w-4 h-4 text-[#8B31E1]" />
            </div>

            {/* Threads */}
            <div className="w-[38px] h-[38px] bg-white rounded-full border border-white flex items-center justify-center hover:bg-gray-100 cursor-pointer transition-all duration-200 hover:scale-110">
              <div className="w-6 h-6 bg-[#8B31E1] rounded-sm"></div>
            </div>

            {/* LinkedIn */}
            <div className="w-[38px] h-[38px] bg-white rounded-full border border-white flex items-center justify-center hover:bg-gray-100 cursor-pointer transition-all duration-200 hover:scale-110">
              <Linkedin className="w-6 h-6 text-[#8B31E1]" />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Back to Top Button */}
    </footer>
  );
}
