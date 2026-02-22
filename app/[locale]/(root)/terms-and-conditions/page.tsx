"use client"
import React, { useState, useEffect, Suspense } from "react";
import { TermsHeader } from "./_components/TermsHeader";
import { Section1Introduction } from "./_components/sections/Section1_Introduction";
import { Section2Eligibility } from "./_components/sections/Section2_Eligibility";
import { Section3NatureOfPlatform } from "./_components/sections/Section3_NatureOfPlatform";
import { Section4UserObligations } from "./_components/sections/Section4_UserObligations";
import { Section5ListingsAndContent } from "./_components/sections/Section5_ListingsAndContent";
import { Section6IntellectualProperty } from "./_components/sections/Section6_IntellectualProperty";
import { Section7Subscriptions } from "./_components/sections/Section7_Subscriptions";
import { Section8Cancellations } from "./_components/sections/Section8_Cancellations";
import { Section9UAERules } from "./_components/sections/Section9_UAERules";
import { Section10Reviews, Section11Communication, Section12ThirdParty } from "./_components/sections/Sections10_11_12";
import { Section13Privacy } from "./_components/sections/Section13_Privacy";
import { Section14CookiePolicy } from "./_components/sections/Section14_CookiePolicy";
import { Section15Disclaimer, Section16Liability, Section17Indemnity } from "./_components/sections/Sections15_16_17";
import { Section18Suspension, Section19Changes, Section20GoverningLaw } from "./_components/sections/Sections18_19_20";
import { Section21Miscellaneous, Section22ContactUs } from "./_components/sections/Sections21_22";
import { Annex1Property, Annex2Motors, Annex3Jobs } from "./_components/sections/Annexes";
import Link from "next/link";

const sections = [
      { title: "1. Introduction", id: "introduction" },
      { title: "2. Eligibility", id: "eligibility" },
      { title: "3. Nature of Platform", id: "nature-of-platform" },
      { title: "4. User Obligations", id: "prohibited-conduct" },
      { title: "5. Listings & Content", id: "listings-and-content" },
      { title: "6. Intellectual Property", id: "intellectual-property" },
      { title: "7. Subscriptions", id: "subscriptions" },
      { title: "8. Cancellations", id: "cancellations" },
      { title: "9. UAE Listing Rules", id: "listing-rules" },
      { title: "10. Reviews & Ratings", id: "reviews" },
      { title: "11. Communication", id: "communication" },
      { title: "12. Third-Party Services", id: "third-party" },
      { title: "13. Privacy Policy", id: "privacy" },
      { title: "14. Cookie Policy", id: "cookies" },
      { title: "15. Disclaimer", id: "disclaimer" },
      { title: "16. Liability & Cap", id: "liability" },
      { title: "17. Indemnity", id: "indemnity" },
      { title: "18. Suspension", id: "suspension" },
      { title: "19. Terms Changes", id: "changes" },
      { title: "20. Governing Law", id: "governing-law" },
      { title: "Annex: Property", id: "annex-property" },
      { title: "Annex: Motors", id: "annex-motors" },
      { title: "Annex: Jobs", id: "annex-jobs" },
      { title: "22. Contact Us", id: "contact" },
];

function TermsContent() {
      const [activeSection, setActiveSection] = useState("introduction");

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

            const observer = new IntersectionObserver(observerCallback, observerOptions);

            sections.forEach((section) => {
                  const element = document.getElementById(section.id);
                  if (element) {
                        observer.observe(element);
                  }
            });

            return () => observer.disconnect();
      }, [activeSection]); // Added activeSection dependency to ensure observer stay sharp but safe-guarding re-renders

      return (
            <div className="bg-gray-50 min-h-screen py-10 px-4 md:px-8 lg:px-12 font-inter shadow-inner scroll-smooth">
                  <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-[2.5rem] mt-10 mb-20 border border-gray-100">
                        <TermsHeader />

                        <div className="flex flex-col lg:flex-row p-6 md:p-12 lg:p-16 gap-12">
                              {/* Table of Contents Sidebar */}
                              <aside className="hidden lg:block w-64 shrink-0">
                                    <div className="sticky top-24 space-y-8">
                                          <div className="relative">
                                                <div className="absolute left-[7px] top-10 bottom-0 w-[1px] bg-gray-100"></div>
                                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-purple/40 mb-6 px-4">
                                                      Navigation
                                                </h3>
                                                <nav className="space-y-1 max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 relative z-10">
                                                      {sections.map((section) => {
                                                            const isActive = activeSection === section.id;
                                                            return (
                                                                  <Link
                                                                        key={section.id}
                                                                        href={`#${section.id}`}
                                                                        className={`group flex items-center py-2 px-4 text-[11px] transition-all duration-300 font-bold rounded-xl ${isActive
                                                                                    ? "text-purple translate-x-1"
                                                                                    : "text-gray-400 hover:text-gray-600"
                                                                              }`}
                                                                  >
                                                                        <div className={`w-[3px] h-3 rounded-full mr-3 transition-all duration-500 scale-y-0 opacity-0 ${isActive
                                                                                    ? "bg-purple scale-y-100 opacity-100 shadow-[0_0_8px_rgba(111,44,242,0.6)]"
                                                                                    : "bg-gray-200"
                                                                              }`}></div>
                                                                        <span className={`transition-all duration-300 ${isActive ? "opacity-100" : "opacity-70 group-hover:opacity-100"}`}>
                                                                              {section.title}
                                                                        </span>
                                                                  </Link>
                                                            );
                                                      })}
                                                </nav>
                                          </div>

                                          <div className="p-6 bg-purple/10 border border-purple/10 rounded-[2rem] relative overflow-hidden group">
                                                <h4 className="text-xs font-black text-purple mb-1 relative z-10">Assistance</h4>
                                                <p className="text-[9px] text-purple/60 leading-relaxed relative z-10">
                                                      Questions about our terms? We are here to help.
                                                </p>
                                                <div className="mt-4 flex items-center gap-2 relative z-10">
                                                      <a href="mailto:support@buyorsell.ae" className="text-[9px] font-black text-purple hover:underline uppercase tracking-widest transition-all hover:tracking-[0.2em]">Email Support</a>
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

                        <div className="bg-gray-50 p-8 md:p-12 text-center border-t border-gray-100 rounded-b-[2.5rem]">
                              <p className="text-[10px] text-gray-400 font-inter tracking-[0.3em] uppercase mb-6">
                                    © 2025 Souq Labs Technologies LLC SPC | BuyOrSell.ae
                              </p>
                              <div className="flex flex-wrap justify-center gap-6">
                                    {[
                                          { name: "Security", link: "#" },
                                          { name: "Privacy", link: "/privacy-policy" },
                                          { name: "Cookies", link: "#" },
                                          { name: "Safety", link: "#" }
                                    ].map((item) => (
                                          <Link key={item.name} href={item.link} className="text-[10px] font-bold text-gray-400 hover:text-purple transition-colors flex items-center gap-2">
                                                <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                                                {item.name}
                                          </Link>
                                    ))}
                              </div>
                        </div>
                  </div>
            </div>
      );
}

export default function TermsAndConditionsPage() {
      return (
            <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center font-inter text-purple animate-pulse">Loading Terms...</div>}>
                  <TermsContent />
            </Suspense>
      );
}
