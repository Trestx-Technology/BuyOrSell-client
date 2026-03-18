"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { TermsHeader } from "./TermsHeader";
import { Section1Introduction } from "./sections/Section1_Introduction";
import { Section2Eligibility } from "./sections/Section2_Eligibility";
import { Section3NatureOfPlatform } from "./sections/Section3_NatureOfPlatform";
import { Section4UserObligations } from "./sections/Section4_UserObligations";
import { Section5ListingsAndContent } from "./sections/Section5_ListingsAndContent";
import { Section6IntellectualProperty } from "./sections/Section6_IntellectualProperty";
import { Section7Subscriptions } from "./sections/Section7_Subscriptions";
import { Section8Cancellations } from "./sections/Section8_Cancellations";
import { Section9UAERules } from "./sections/Section9_UAERules";
import {
  Section10Reviews,
  Section11Communication,
  Section12ThirdParty,
} from "./sections/Sections10_11_12";
import { Section13Privacy } from "./sections/Section13_Privacy";
import { Section14CookiePolicy } from "./sections/Section14_CookiePolicy";
import {
  Section15Disclaimer,
  Section16Liability,
  Section17Indemnity,
} from "./sections/Sections15_16_17";
import {
  Section18Suspension,
  Section19Changes,
  Section20GoverningLaw,
} from "./sections/Sections18_19_20";
import {
  Section21Miscellaneous,
  Section22ContactUs,
} from "./sections/Sections21_22";
import { Annex1Property, Annex2Motors, Annex3Jobs } from "./sections/Annexes";

import { useLocale } from "@/hooks/useLocale";

export function TermsContent() {
  const { t } = useLocale();
  const [activeSection, setActiveSection] = useState("introduction");

  const sections = [
    { title: t.termsAndConditions.sections.introduction.title, id: "introduction" },
    { title: t.termsAndConditions.sections.eligibility.title, id: "eligibility" },
    { title: t.termsAndConditions.sections.natureOfPlatform.title, id: "nature-of-platform" },
    { title: t.termsAndConditions.sections.userObligations.title, id: "user-obligations" },
    { title: t.termsAndConditions.sections.listingsAndContent.title, id: "listings-content" },
    { title: t.termsAndConditions.sections.intellectualProperty.title, id: "intellectual-property" },
    { title: t.termsAndConditions.sections.subscriptions.title, id: "subscriptions" },
    { title: t.termsAndConditions.sections.cancellations.title, id: "cancellations" },
    { title: t.termsAndConditions.sections.uaeRules.title, id: "uae-rules" },
    { title: t.termsAndConditions.sections.reviews.title, id: "reviews" },
    { title: t.termsAndConditions.sections.communication.title, id: "communication" },
    { title: t.termsAndConditions.sections.thirdParty.title, id: "third-party" },
    { title: t.termsAndConditions.sections.privacy.title, id: "privacy" },
    { title: t.termsAndConditions.sections.cookiePolicy.title, id: "cookie-policy" },
    { title: t.termsAndConditions.sections.disclaimer.title, id: "disclaimer" },
    { title: t.termsAndConditions.sections.liability.title, id: "liability" },
    { title: t.termsAndConditions.sections.indemnity.title, id: "indemnity" },
    { title: t.termsAndConditions.sections.suspension.title, id: "suspension" },
    { title: t.termsAndConditions.sections.changes.title, id: "changes" },
    { title: t.termsAndConditions.sections.governingLaw.title, id: "governing-law" },
    { title: t.termsAndConditions.sections.miscellaneous.title, id: "miscellaneous" },
    { title: t.termsAndConditions.sections.contact.title, id: "contact" },
    { title: t.termsAndConditions.sections.annex1Property.title, id: "annex-1-property" },
    { title: t.termsAndConditions.sections.annex2Motors.title, id: "annex-2-motors" },
    { title: t.termsAndConditions.sections.annex3Jobs.title, id: "annex-3-jobs" },
  ];

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-25% 0px -70% 0px",
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [activeSection]);

  return (
    <div className="bg-gray-50 dark:bg-[#0B0F19] min-h-screen py-20 px-4 md:px-8 lg:px-12 font-inter shadow-inner scroll-smooth">
      <div className="max-w-6xl mx-auto bg-white dark:bg-[#121827] shadow-2xl rounded-[2.5rem] mb-20 border border-gray-100 dark:border-gray-800">
        <TermsHeader />

        <div className="flex flex-col lg:flex-row p-6 md:p-12 lg:p-16 gap-12">
          {/* Table of Contents Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 space-y-8">
              <div className="relative">
                <div className="absolute left-[7px] top-10 bottom-0 w-[1px] bg-gray-100 dark:bg-gray-800"></div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-purple/40 mb-6 px-4">
                  {t.termsAndConditions.navigation}
                </h3>
                <nav className="space-y-1 max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 relative z-10">
                  {sections.map((section) => {
                    const isActive = activeSection === section.id;
                    return (
                      <Link
                        key={section.id}
                        href={`#${section.id}`}
                        className={`group flex items-center py-2 px-4 text-[11px] transition-all duration-300 font-bold rounded-xl ${
                          isActive
                            ? "text-purple translate-x-1 bg-purple/5"
                            : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                        }`}
                      >
                        <div
                          className={`w-[3px] h-3 rounded-full mr-3 transition-all duration-500 scale-y-0 opacity-0 ${
                            isActive
                              ? "bg-purple scale-y-100 opacity-100 shadow-[0_0_8px_rgba(111,44,242,0.6)]"
                              : "bg-gray-200 dark:bg-gray-700"
                          }`}
                        ></div>
                        <span
                          className={`transition-all duration-300 ${isActive ? "opacity-100" : "opacity-70 group-hover:opacity-100"}`}
                        >
                          {section.title}
                        </span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="p-6 bg-purple/5 dark:bg-purple/10 border border-purple/10 rounded-[2rem] relative overflow-hidden group hover:border-purple/30 transition-colors">
                <h4 className="text-xs font-black text-purple mb-1 relative z-10">
                  {t.termsAndConditions.assistance.title}
                </h4>
                <p className="text-[9px] text-purple/60 leading-relaxed relative z-10">
                  {t.termsAndConditions.assistance.description}
                </p>
                <div className="mt-4 flex items-center gap-2 relative z-10">
                  <a
                    href="mailto:support@buyorsell.ae"
                    className="text-[9px] font-black text-purple hover:underline uppercase tracking-widest transition-all hover:tracking-[0.2em] flex items-center gap-1"
                  >
                    <Mail className="w-3 h-3" /> {t.termsAndConditions.assistance.emailSupport}
                  </a>
                </div>
              </div>
            </div>
          </aside>

          {/* Content Area */}
          <div className="flex-1 min-w-0 space-y-24">
            <Section1Introduction />
            <Section2Eligibility />
            <Section3NatureOfPlatform />
            <Section4UserObligations />
            <Section5ListingsAndContent />
            <Section6IntellectualProperty />
            <Section7Subscriptions />
            <Section8Cancellations />
            <Section9UAERules />
            <Section10Reviews />
            <Section11Communication />
            <Section12ThirdParty />
            <Section13Privacy />
            <Section14CookiePolicy />
            <Section15Disclaimer />
            <Section16Liability />
            <Section17Indemnity />
            <Section18Suspension />
            <Section19Changes />
            <Section20GoverningLaw />
            <Section21Miscellaneous />

            <div className="space-y-20 pt-16 border-t border-gray-100">
              <Annex1Property />
              <Annex2Motors />
              <Annex3Jobs />
            </div>

            <Section22ContactUs />
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800/50 p-8 md:p-12 text-center border-t border-gray-100 dark:border-gray-800 rounded-b-[2.5rem]">
          <p className="text-[10px] text-gray-400 font-inter tracking-[0.3em] uppercase mb-6">
            © 2025 Souq Labs Technologies LLC SPC | BuyOrSell.ae
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {[
              { name: "Security", link: "#" },
              { name: "Privacy", link: "/privacy-policy" },
              { name: "Cookies", link: "#" },
              { name: "Safety", link: "#" },
            ].map((item) => (
              <Link
                key={item.name}
                href={item.link}
                className="text-[10px] font-bold text-gray-400 dark:text-gray-500 hover:text-purple transition-colors flex items-center gap-2"
              >
                <span className="w-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full"></span>
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
