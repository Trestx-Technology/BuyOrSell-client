"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Mail, MapPin, ExternalLink } from "lucide-react";
import { useLocale } from "@/hooks/useLocale";

export function TermsContent() {
  const { t } = useLocale();
  const [activeSection, setActiveSection] = useState("introduction");

  const sections = [
    {
      title: t.termsAndConditions.sections.introduction.title,
      id: "introduction",
    },
    {
      title: t.termsAndConditions.sections.eligibility.title,
      id: "eligibility",
    },
    {
      title: t.termsAndConditions.sections.natureOfPlatform.title,
      id: "nature-of-platform",
    },
    {
      title: t.termsAndConditions.sections.userObligations.title,
      id: "user-obligations",
    },
    {
      title: t.termsAndConditions.sections.listingsAndContent.title,
      id: "listings-content",
    },
    {
      title: t.termsAndConditions.sections.intellectualProperty.title,
      id: "intellectual-property",
    },
    {
      title: t.termsAndConditions.sections.subscriptions.title,
      id: "subscriptions",
    },
    {
      title: t.termsAndConditions.sections.cancellations.title,
      id: "cancellations",
    },
    { title: t.termsAndConditions.sections.uaeRules.title, id: "uae-rules" },
    { title: t.termsAndConditions.sections.reviews.title, id: "reviews" },
    {
      title: t.termsAndConditions.sections.communication.title,
      id: "communication",
    },
    {
      title: t.termsAndConditions.sections.thirdParty.title,
      id: "third-party",
    },
    { title: t.termsAndConditions.sections.privacy.title, id: "privacy" },
    {
      title: t.termsAndConditions.sections.cookiePolicy.title,
      id: "cookie-policy",
    },
    { title: t.termsAndConditions.sections.disclaimer.title, id: "disclaimer" },
    { title: t.termsAndConditions.sections.liability.title, id: "liability" },
    { title: t.termsAndConditions.sections.indemnity.title, id: "indemnity" },
    { title: t.termsAndConditions.sections.suspension.title, id: "suspension" },
    { title: t.termsAndConditions.sections.changes.title, id: "changes" },
    {
      title: t.termsAndConditions.sections.governingLaw.title,
      id: "governing-law",
    },
    {
      title: t.termsAndConditions.sections.miscellaneous.title,
      id: "miscellaneous",
    },
    { title: t.termsAndConditions.sections.contact.title, id: "contact" },
    {
      title: t.termsAndConditions.sections.annex1Property.title,
      id: "annex-1-property",
    },
    {
      title: t.termsAndConditions.sections.annex2Motors.title,
      id: "annex-2-motors",
    },
    {
      title: t.termsAndConditions.sections.annex3Jobs.title,
      id: "annex-3-jobs",
    },
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
  }, [activeSection, sections]);

  // UI Components
  const SectionHeading = ({
    children,
    id,
    className = "",
  }: {
    children: React.ReactNode;
    id: string;
    className?: string;
  }) => (
    <div id={id} className={`scroll-mt-24 mb-8 ${className}`}>
      <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2 leading-tight">
        {children}
      </h2>
      <div className="w-12 h-1 bg-purple/20 rounded-full"></div>
    </div>
  );

  const SubHeading = ({
    children,
    className = "",
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <h3
      className={`text-xl font-bold text-gray-800 dark:text-gray-100 mt-8 mb-4 ${className}`}
    >
      {children}
    </h3>
  );

  const Paragraph = ({
    children,
    className = "",
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <p
      className={`text-sm leading-relaxed mb-4 text-gray-600 dark:text-gray-300 ${className}`}
    >
      {children}
    </p>
  );

  const List = ({
    children,
    className = "",
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <ul
      className={`list-disc list-inside space-y-2 mb-6 text-sm text-gray-600 dark:text-gray-300 ml-2 ${className}`}
    >
      {children}
    </ul>
  );

  const Table = ({
    headers,
    rows,
  }: {
    headers: string[];
    rows: string[][];
  }) => (
    <div className="overflow-x-auto mb-8 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-200">
          <tr>
            {headers.map((h, i) => (
              <th
                key={i}
                className="px-4 py-3 font-bold uppercase text-[10px] tracking-widest whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
          {rows.map((row, i) => (
            <tr
              key={i}
              className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 leading-relaxed">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="bg-gray-50 dark:bg-[#0B0F19] min-h-screen py-20 px-4 md:px-8 lg:px-12 font-inter shadow-inner scroll-smooth">
      <div className="max-w-6xl mx-auto bg-white dark:bg-[#121827] shadow-2xl rounded-[2.5rem] mb-20 border border-gray-100 dark:border-gray-800">
        {/* Header - Gradient Style Matches Privacy Policy */}
        <div className="text-center py-20 p-6 bg-gradient-to-b from-purple/10 to-transparent relative">
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight drop-shadow-sm">
            {t.termsAndConditions.title}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium max-w-2xl mx-auto">
            {t.termsAndConditions.subtitle}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
            <span className="bg-white dark:bg-gray-800 py-2.5 px-6 rounded-full shadow-sm border border-gray-100 dark:border-gray-700/50 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-purple rounded-full animate-pulse"></span>
              {t.termsAndConditions.lastUpdated}
            </span>
            <span className="bg-white dark:bg-gray-800 py-2.5 px-6 rounded-full shadow-sm border border-gray-100 dark:border-gray-700/50">
              {t.termsAndConditions.region}
            </span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row p-6 md:p-12 lg:p-16 gap-12 relative">
          {/* Table of Contents Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0 border-r border-gray-50 dark:border-gray-800/50 pr-8">
            <div className="sticky top-24 space-y-8">
              <div className="relative">
                <div className="absolute left-[7px] top-10 bottom-0 w-[1px] bg-gray-100 dark:bg-gray-800"></div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-purple/40 mb-6 px-4">
                  {t.termsAndConditions.navigation}
                </h3>
                <nav className="space-y-1 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 relative z-10">
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

              <div className="p-8 bg-purple/5 dark:bg-purple/10 border border-purple/10 rounded-[2.5rem] relative overflow-hidden group hover:border-purple/30 transition-all duration-500 shadow-sm hover:shadow-purple/5">
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple/10 blur-3xl -mr-10 -mt-10 group-hover:bg-purple/20 transition-colors"></div>
                <h4 className="text-sm font-black text-purple mb-2 relative z-10 tracking-tight">
                  {t.termsAndConditions.assistance.title}
                </h4>
                <p className="text-[11px] text-purple/60 leading-relaxed mb-6 relative z-10 font-medium">
                  {t.termsAndConditions.assistance.description}
                </p>
                <div className="relative z-10">
                  <a
                    href="mailto:support@buyorsell.ae"
                    className="text-[11px] font-black text-purple hover:underline uppercase tracking-widest transition-all hover:tracking-[0.2em] flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" /> {t.termsAndConditions.assistance.emailSupport}
                  </a>
                </div>
              </div>
            </div>
          </aside>

          {/* Content Area Rendering Structured Translations */}
          <div className="flex-1 min-w-0 space-y-24 scroll-smooth">
            {/* 1. Introduction */}
            <section>
              <SectionHeading id="introduction">
                {t.termsAndConditions.sections.introduction.title}
              </SectionHeading>
              {t.termsAndConditions.sections.introduction.items.map(
                (item, i) => (
                  <Paragraph key={i}>{item}</Paragraph>
                ),
              )}
            </section>

            {/* 2. Eligibility */}
            <section>
              <SectionHeading id="eligibility">
                {t.termsAndConditions.sections.eligibility.title}
              </SectionHeading>
              <List>
                {t.termsAndConditions.sections.eligibility.items.map(
                  (item, i) => (
                    <li key={i}>{item}</li>
                  ),
                )}
              </List>
            </section>

            {/* 3. Nature of Platform */}
            <section>
              <SectionHeading id="nature-of-platform">
                {t.termsAndConditions.sections.natureOfPlatform.title}
              </SectionHeading>
              <Paragraph>
                {t.termsAndConditions.sections.natureOfPlatform.intro}
              </Paragraph>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mb-8 bg-gray-50/50 dark:bg-gray-800/30 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-inner">
                {t.termsAndConditions.sections.natureOfPlatform.categories.map(
                  (cat, i) => (
                    <div key={i} className="flex items-start gap-3 py-1">
                      <span className="w-1.5 h-1.5 bg-purple/40 rounded-full mt-2"></span>
                      <span className="text-[12px] leading-relaxed text-gray-700 dark:text-gray-300 font-medium">
                        {cat}
                      </span>
                    </div>
                  ),
                )}
              </div>
              <Paragraph>
                {t.termsAndConditions.sections.natureOfPlatform.outro}
              </Paragraph>
              <div className="pt-6">
                <SubHeading>
                  {t.termsAndConditions.sections.natureOfPlatform.notRole.title}
                </SubHeading>
                <List>
                  {t.termsAndConditions.sections.natureOfPlatform.notRole.items.map(
                    (item, i) => (
                      <li key={i}>{item}</li>
                    ),
                  )}
                </List>
              </div>
              <Paragraph>
                {t.termsAndConditions.sections.natureOfPlatform.verification}
              </Paragraph>
            </section>

            {/* 4. User Obligations */}
            <section>
              <SectionHeading id="user-obligations">
                {t.termsAndConditions.sections.userObligations.title}
              </SectionHeading>
              <Paragraph>
                {t.termsAndConditions.sections.userObligations.intro}
              </Paragraph>
              <List>
                {t.termsAndConditions.sections.userObligations.prohibited.map(
                  (item, i) => (
                    <li key={i}>{item}</li>
                  ),
                )}
              </List>
              <Paragraph>
                {t.termsAndConditions.sections.userObligations.outro}
              </Paragraph>
            </section>

            {/* 5. Listings and Content */}
            <section>
              <SectionHeading id="listings-content">
                {t.termsAndConditions.sections.listingsAndContent.title}
              </SectionHeading>
              <Paragraph>
                {t.termsAndConditions.sections.listingsAndContent.definitions}
              </Paragraph>
              <div className="bg-gray-50/50 dark:bg-gray-800/20 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 mb-6">
                <Paragraph>
                  <strong>
                    {
                      t.termsAndConditions.sections.listingsAndContent
                        .responsibilities[0]
                    }
                  </strong>
                </Paragraph>
                <List>
                  {t.termsAndConditions.sections.listingsAndContent.responsibilities
                    .slice(1)
                    .map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                </List>
              </div>
              <Paragraph>
                {t.termsAndConditions.sections.listingsAndContent.rights}
              </Paragraph>
              <Paragraph>
                {t.termsAndConditions.sections.listingsAndContent.backups}
              </Paragraph>
            </section>

            {/* 6. Intellectual Property */}
            <section>
              <SectionHeading id="intellectual-property">
                {t.termsAndConditions.sections.intellectualProperty.title}
              </SectionHeading>
              <Paragraph>
                {t.termsAndConditions.sections.intellectualProperty.ownership}
              </Paragraph>
              <Paragraph>
                {t.termsAndConditions.sections.intellectualProperty.licence}
              </Paragraph>
              <Paragraph>
                {t.termsAndConditions.sections.intellectualProperty.userGrant}
              </Paragraph>
              <Paragraph>
                {
                  t.termsAndConditions.sections.intellectualProperty
                    .userOwnership
                }
              </Paragraph>
            </section>

            {/* 7. Subscriptions */}
            <section>
              <SectionHeading id="subscriptions">
                {t.termsAndConditions.sections.subscriptions.title}
              </SectionHeading>
              <Paragraph>
                {t.termsAndConditions.sections.subscriptions.features}
              </Paragraph>
              <Paragraph>
                {t.termsAndConditions.sections.subscriptions.payments}
              </Paragraph>
              <Paragraph>
                {t.termsAndConditions.sections.subscriptions.renewals}
              </Paragraph>
              <div className="bg-purple/5 p-6 rounded-2xl border border-purple/10 mb-6">
                <Paragraph>
                  {t.termsAndConditions.sections.subscriptions.commitment}
                </Paragraph>
              </div>
              <Paragraph>
                {t.termsAndConditions.sections.subscriptions.checkoutAuth}
              </Paragraph>
            </section>

            {/* 8. Cancellations and Refunds */}
            <section>
              <SectionHeading id="cancellations">
                {t.termsAndConditions.sections.cancellations.title}
              </SectionHeading>
              <Paragraph>
                {t.termsAndConditions.sections.cancellations.process}
              </Paragraph>
              <Paragraph>
                {t.termsAndConditions.sections.cancellations.access}
              </Paragraph>
              <Paragraph>
                {t.termsAndConditions.sections.cancellations.refunds}
              </Paragraph>
              <Paragraph>
                {t.termsAndConditions.sections.cancellations.refundMethod}
              </Paragraph>
              <Paragraph>
                {t.termsAndConditions.sections.cancellations.alternativeMethod}
              </Paragraph>
            </section>

            {/* 9. UAE Rules */}
            <section>
              <SectionHeading id="uae-rules">
                {t.termsAndConditions.sections.uaeRules.title}
              </SectionHeading>
              <Paragraph>
                {t.termsAndConditions.sections.uaeRules.exclusivity}
              </Paragraph>
              <Paragraph>
                {t.termsAndConditions.sections.uaeRules.categorization}
              </Paragraph>
              <SubHeading>Category Compliance Guidelines</SubHeading>
              <Table
                headers={
                  t.termsAndConditions.sections.uaeRules.rulesTable.headers
                }
                rows={t.termsAndConditions.sections.uaeRules.rulesTable.rows}
              />
              <Paragraph>
                {t.termsAndConditions.sections.uaeRules.specialApprovals}
              </Paragraph>
              <Paragraph>
                {t.termsAndConditions.sections.uaeRules.compliance}
              </Paragraph>
            </section>

            {/* 10. Reviews */}
            <section>
              <SectionHeading id="reviews">
                {t.termsAndConditions.sections.reviews.title}
              </SectionHeading>
              <Paragraph>
                {t.termsAndConditions.sections.reviews.intro}
              </Paragraph>
              <Paragraph>
                {t.termsAndConditions.sections.reviews.guidelines.intro}
              </Paragraph>
              <List>
                {t.termsAndConditions.sections.reviews.guidelines.items.map(
                  (item, i) => (
                    <li key={i}>{item}</li>
                  ),
                )}
              </List>
              <Paragraph>
                {t.termsAndConditions.sections.reviews.disclaimer}
              </Paragraph>
              <Paragraph>
                {t.termsAndConditions.sections.reviews.monitoring}
              </Paragraph>
            </section>

            {/* 11. Communication */}
            <section>
              <SectionHeading id="communication">
                {t.termsAndConditions.sections.communication.title}
              </SectionHeading>
              <Paragraph>
                {t.termsAndConditions.sections.communication.intro}
              </Paragraph>
              <Paragraph>
                {t.termsAndConditions.sections.communication.prohibitions}
              </Paragraph>
              <Paragraph>
                {t.termsAndConditions.sections.communication.investigation}
              </Paragraph>
            </section>

            {/* 12. Third Party */}
            <section>
              <SectionHeading id="third-party">
                {t.termsAndConditions.sections.thirdParty.title}
              </SectionHeading>
              <Paragraph>
                {t.termsAndConditions.sections.thirdParty.links}
              </Paragraph>
              <Paragraph>
                {t.termsAndConditions.sections.thirdParty.policies}
              </Paragraph>
              <Paragraph>
                {t.termsAndConditions.sections.thirdParty.liability}
              </Paragraph>
            </section>

            {/* 13. Privacy */}
            <section>
              <SectionHeading id="privacy">
                {t.termsAndConditions.sections.privacy.title}
              </SectionHeading>
              <Paragraph>
                {t.termsAndConditions.sections.privacy.intro}
              </Paragraph>
              <Paragraph>
                {t.termsAndConditions.sections.privacy.consent}
              </Paragraph>
              <Paragraph>
                {t.termsAndConditions.sections.privacy.controllerResp}
              </Paragraph>
              <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-800 text-blue-800 dark:text-blue-300">
                <Paragraph className="mb-0 font-medium flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  {t.termsAndConditions.sections.privacy.security}
                </Paragraph>
              </div>
            </section>

            {/* 14. Cookie Policy */}
            <section>
              <SectionHeading id="cookie-policy">
                {t.termsAndConditions.sections.cookiePolicy.title}
              </SectionHeading>
              <div className="bg-gray-50/80 dark:bg-gray-800/40 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm mb-12">
                <Paragraph className="font-bold underline tracking-widest uppercase text-[10px] text-gray-400 mb-8 block">
                  {t.termsAndConditions.sections.cookiePolicy.intro}
                </Paragraph>

                <SubHeading>
                  {
                    t.termsAndConditions.sections.cookiePolicy.whatAreCookies
                      .title
                  }
                </SubHeading>
                <Paragraph>
                  {
                    t.termsAndConditions.sections.cookiePolicy.whatAreCookies
                      .content
                  }
                </Paragraph>

                <SubHeading>
                  {
                    t.termsAndConditions.sections.cookiePolicy.cookiesWeUse
                      .title
                  }
                </SubHeading>
                <Table
                  headers={
                    t.termsAndConditions.sections.cookiePolicy.cookiesWeUse
                      .table.headers
                  }
                  rows={
                    t.termsAndConditions.sections.cookiePolicy.cookiesWeUse
                      .table.rows
                  }
                />

                <SubHeading>
                  {t.termsAndConditions.sections.cookiePolicy.categories.title}
                </SubHeading>
                <List>
                  {t.termsAndConditions.sections.cookiePolicy.categories.definitions.map(
                    (item, i) => (
                      <li key={i}>{item}</li>
                    ),
                  )}
                </List>

                <SubHeading>
                  {t.termsAndConditions.sections.cookiePolicy.management.title}
                </SubHeading>
                <Paragraph className="font-bold mb-2">
                  {
                    t.termsAndConditions.sections.cookiePolicy.management
                      .firstVisit[0]
                  }
                </Paragraph>
                <List>
                  {t.termsAndConditions.sections.cookiePolicy.management.firstVisit
                    .slice(1)
                    .map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                </List>
                <Paragraph className="font-bold mb-2">
                  {
                    t.termsAndConditions.sections.cookiePolicy.management
                      .anytime[0]
                  }
                </Paragraph>
                <List>
                  {t.termsAndConditions.sections.cookiePolicy.management.anytime
                    .slice(1)
                    .map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                </List>
                <div className="bg-yellow-50/50 dark:bg-yellow-900/10 p-4 rounded-xl border border-yellow-100 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200 text-xs italic">
                  {
                    t.termsAndConditions.sections.cookiePolicy.management
                      .important
                  }
                </div>

                <SubHeading>
                  {
                    t.termsAndConditions.sections.cookiePolicy.thirdParties
                      .title
                  }
                </SubHeading>
                <Table
                  headers={
                    t.termsAndConditions.sections.cookiePolicy.thirdParties
                      .table.headers
                  }
                  rows={
                    t.termsAndConditions.sections.cookiePolicy.thirdParties
                      .table.rows
                  }
                />

                <SubHeading>
                  {t.termsAndConditions.sections.cookiePolicy.legal.title}
                </SubHeading>
                <List>
                  {t.termsAndConditions.sections.cookiePolicy.legal.items.map(
                    (item, i) => (
                      <li key={i}>{item}</li>
                    ),
                  )}
                </List>

                <div className="space-y-8 pt-8 border-t border-gray-100 dark:border-gray-800">
                  <div>
                    <SubHeading>
                      {
                        t.termsAndConditions.sections.cookiePolicy.children
                          .title
                      }
                    </SubHeading>
                    <Paragraph>
                      {
                        t.termsAndConditions.sections.cookiePolicy.children
                          .content
                      }
                    </Paragraph>
                  </div>
                  <div>
                    <SubHeading>
                      {
                        t.termsAndConditions.sections.cookiePolicy.transfers
                          .title
                      }
                    </SubHeading>
                    <Paragraph>
                      {
                        t.termsAndConditions.sections.cookiePolicy.transfers
                          .content
                      }
                    </Paragraph>
                  </div>
                  <div>
                    <SubHeading>
                      {t.termsAndConditions.sections.cookiePolicy.updates.title}
                    </SubHeading>
                    <Paragraph>
                      {
                        t.termsAndConditions.sections.cookiePolicy.updates
                          .content
                      }
                    </Paragraph>
                  </div>
                </div>
              </div>
            </section>

            {/* 15, 16, 17 Legal Protections */}
            <div className="space-y-24 bg-gray-50/30 dark:bg-gray-900/20 p-8 rounded-[3rem] border border-gray-100 dark:border-gray-800">
              <section>
                <SectionHeading id="disclaimer">
                  {t.termsAndConditions.sections.disclaimer.title}
                </SectionHeading>
                <Paragraph>
                  {t.termsAndConditions.sections.disclaimer.basis}
                </Paragraph>
                <Paragraph>
                  {t.termsAndConditions.sections.disclaimer.scope}
                </Paragraph>
                <Paragraph>
                  {t.termsAndConditions.sections.disclaimer.continuity}
                </Paragraph>
                <Paragraph>
                  {t.termsAndConditions.sections.disclaimer.accuracy}
                </Paragraph>
              </section>

              <section>
                <SectionHeading id="liability">
                  {t.termsAndConditions.sections.liability.title}
                </SectionHeading>
                <Paragraph>
                  {t.termsAndConditions.sections.liability.indirect}
                </Paragraph>
                <Paragraph>
                  {t.termsAndConditions.sections.liability.availability}
                </Paragraph>
                <div className="bg-red-50/30 dark:bg-red-900/10 p-6 rounded-2xl border border-red-100 dark:border-red-900/50">
                  <Paragraph className="mb-0 text-red-900 dark:text-red-300 font-bold uppercase tracking-wider text-[11px] mb-2 block">
                    Aggregate Limitation
                  </Paragraph>
                  <Paragraph className="mb-0 text-red-800 dark:text-red-200 italic">
                    {t.termsAndConditions.sections.liability.aggregate}
                  </Paragraph>
                </div>
                <Paragraph className="mt-6 font-bold">
                  {t.termsAndConditions.sections.liability.statutory}
                </Paragraph>
              </section>

              <section>
                <SectionHeading id="indemnity">
                  {t.termsAndConditions.sections.indemnity.title}
                </SectionHeading>
                <Paragraph>
                  {t.termsAndConditions.sections.indemnity.scope}
                </Paragraph>
                <Paragraph>
                  {t.termsAndConditions.sections.indemnity.defenseControl}
                </Paragraph>
              </section>
            </div>

            {/* 18, 19, 20 Misc Procedures */}
            <section>
              <SectionHeading id="suspension">
                {t.termsAndConditions.sections.suspension.title}
              </SectionHeading>
              <Paragraph>
                {t.termsAndConditions.sections.suspension.reasons}
              </Paragraph>
              <Paragraph>
                {t.termsAndConditions.sections.suspension.effects}
              </Paragraph>
              <Paragraph>
                {t.termsAndConditions.sections.suspension.userTermination}
              </Paragraph>
            </section>

            <section>
              <SectionHeading id="changes">
                {t.termsAndConditions.sections.changes.title}
              </SectionHeading>
              <Paragraph>
                {t.termsAndConditions.sections.changes.aspects}
              </Paragraph>
              <Paragraph>
                {t.termsAndConditions.sections.changes.revision}
              </Paragraph>
              <Paragraph>
                {t.termsAndConditions.sections.changes.acceptance}
              </Paragraph>
            </section>

            <section>
              <SectionHeading id="governing-law">
                {t.termsAndConditions.sections.governingLaw.title}
              </SectionHeading>
              <Paragraph>
                {t.termsAndConditions.sections.governingLaw.governance}
              </Paragraph>
              <Paragraph>
                {t.termsAndConditions.sections.governingLaw.jurisdiction}
              </Paragraph>
              <Paragraph>
                {t.termsAndConditions.sections.governingLaw.amicable}
              </Paragraph>
            </section>

            {/* 21. Miscellaneous */}
            <section>
              <SectionHeading id="miscellaneous">
                {t.termsAndConditions.sections.miscellaneous.title}
              </SectionHeading>
              <div className="space-y-4">
                <Paragraph>
                  <strong>21.1 Severability:</strong>{" "}
                  {t.termsAndConditions.sections.miscellaneous.severability}
                </Paragraph>
                <Paragraph>
                  <strong>21.2 Non-Waiver:</strong>{" "}
                  {t.termsAndConditions.sections.miscellaneous.nonWaiver}
                </Paragraph>
                <Paragraph>
                  <strong>21.3 Assignment:</strong>{" "}
                  {t.termsAndConditions.sections.miscellaneous.assignment}
                </Paragraph>
                <Paragraph>
                  <strong>21.4 Entire Agreement:</strong>{" "}
                  {t.termsAndConditions.sections.miscellaneous.entireAgreement}
                </Paragraph>
                <div className="p-6 bg-gray-50 dark:bg-gray-800/20 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm transition-all duration-300 hover:shadow-md">
                  <Paragraph>
                    <strong>21.5 Verified Business Account:</strong>{" "}
                    {
                      t.termsAndConditions.sections.miscellaneous
                        .verifiedBusiness
                    }
                  </Paragraph>
                </div>
                <Paragraph className="italic bg-purple/5 p-4 rounded-xl text-purple tracking-wide">
                  {t.termsAndConditions.sections.miscellaneous.annexesRef}
                </Paragraph>
              </div>
            </section>

            {/* Annexes Section */}
            <div className="space-y-32 pt-16 border-t border-gray-100 dark:border-gray-800">
              {/* Annex 1: Property */}
              <section>
                <SectionHeading id="annex-1-property">
                  {t.termsAndConditions.sections.annex1Property.title}
                </SectionHeading>
                <Paragraph className="text-base font-medium text-gray-900 dark:text-white mb-8">
                  {t.termsAndConditions.sections.annex1Property.intro}
                </Paragraph>
                <div className="space-y-12 pl-4">
                  <div>
                    <SubHeading className="mt-0">
                      {
                        t.termsAndConditions.sections.annex1Property.owners
                          .title
                      }
                    </SubHeading>
                    <List>
                      {t.termsAndConditions.sections.annex1Property.owners.items.map(
                        (item, i) => (
                          <li key={i}>{item}</li>
                        ),
                      )}
                    </List>
                  </div>
                  <div>
                    <SubHeading>
                      {
                        t.termsAndConditions.sections.annex1Property.brokers
                          .title
                      }
                    </SubHeading>
                    <List>
                      {t.termsAndConditions.sections.annex1Property.brokers.items.map(
                        (item, i) => (
                          <li key={i}>{item}</li>
                        ),
                      )}
                    </List>
                  </div>
                  <div>
                    <SubHeading>
                      {
                        t.termsAndConditions.sections.annex1Property
                          .buyersRenters.title
                      }
                    </SubHeading>
                    <List>
                      {t.termsAndConditions.sections.annex1Property.buyersRenters.items.map(
                        (item, i) => (
                          <li key={i}>{item}</li>
                        ),
                      )}
                    </List>
                  </div>
                </div>
              </section>

              {/* Annex 2: Motors */}
              <section>
                <SectionHeading id="annex-2-motors">
                  {t.termsAndConditions.sections.annex2Motors.title}
                </SectionHeading>
                <Paragraph className="text-base font-medium text-gray-900 dark:text-white mb-8">
                  {t.termsAndConditions.sections.annex2Motors.intro}
                </Paragraph>
                <div className="pl-4">
                  <SubHeading className="mt-0">
                    {t.termsAndConditions.sections.annex2Motors.sellers.title}
                  </SubHeading>
                  <List>
                    {t.termsAndConditions.sections.annex2Motors.sellers.items.map(
                      (item, i) => (
                        <li key={i}>{item}</li>
                      ),
                    )}
                  </List>
                  <div className="bg-yellow-50/30 dark:bg-yellow-900/10 p-6 rounded-2xl border border-yellow-100 dark:border-yellow-900/50 mt-12">
                    <SubHeading className="mt-0 text-yellow-900 dark:text-yellow-200 mb-2">
                      {
                        t.termsAndConditions.sections.annex2Motors
                          .proofOwnership.title
                      }
                    </SubHeading>
                    <Paragraph className="mb-0 text-yellow-800 dark:text-yellow-300 italic">
                      {
                        t.termsAndConditions.sections.annex2Motors
                          .proofOwnership.content
                      }
                    </Paragraph>
                  </div>
                </div>
              </section>

              {/* Annex 3: Jobs */}
              <section>
                <SectionHeading id="annex-3-jobs">
                  {t.termsAndConditions.sections.annex3Jobs.title}
                </SectionHeading>
                <Paragraph className="text-base font-medium text-gray-900 dark:text-white mb-8">
                  {t.termsAndConditions.sections.annex3Jobs.intro}
                </Paragraph>
                <div className="pl-4 space-y-12">
                  <div>
                    <SubHeading className="mt-0">
                      {t.termsAndConditions.sections.annex3Jobs.employers.title}
                    </SubHeading>
                    <List>
                      {t.termsAndConditions.sections.annex3Jobs.employers.items.map(
                        (item, i) => (
                          <li key={i}>{item}</li>
                        ),
                      )}
                    </List>
                  </div>
                  <div>
                    <SubHeading>
                      {
                        t.termsAndConditions.sections.annex3Jobs.jobSeekers
                          .title
                      }
                    </SubHeading>
                    <List>
                      {t.termsAndConditions.sections.annex3Jobs.jobSeekers.items.map(
                        (item, i) => (
                          <li key={i}>{item}</li>
                        ),
                      )}
                    </List>
                  </div>
                </div>
              </section>
            </div>

            {/* 22. Contact Details Section - Styled to match Privacy Policy */}
            <section>
              <SectionHeading id="contact">
                {" "}
                {t.termsAndConditions.sections.contact.title}
              </SectionHeading>
              <Paragraph>
                {t.termsAndConditions.sections.contact.intro}
              </Paragraph>
              <div className="bg-gray-50/50 dark:bg-gray-800/30 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 relative overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-black text-gray-900 dark:text-white mb-6 tracking-wide uppercase text-xs">
                        {t.termsAndConditions.sections.contact.registeredEntity}
                      </h4>
                      <p className="text-sm font-bold text-purple mb-1">
                        {t.termsAndConditions.sections.contact.labels.companyName}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {t.termsAndConditions.sections.contact.company}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-bold text-purple mb-1 mt-6">
                        {t.termsAndConditions.sections.contact.labels.locationAddress}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        <MapPin className="inline-block w-4 h-4 mr-2 -mt-1 text-purple" />
                        {t.termsAndConditions.sections.contact.address}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="font-black text-gray-900 dark:text-white mb-6 tracking-wide uppercase text-xs">
                        {t.termsAndConditions.sections.contact.labels.directSupport}
                      </h4>
                      <div className="space-y-3">
                        <a
                          href={`mailto:${t.termsAndConditions.sections.contact.email}`}
                          className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300 hover:text-purple transition-colors"
                        >
                          <div className="w-8 h-8 rounded-full bg-purple/10 flex items-center justify-center">
                            <Mail className="w-4 h-4 text-purple" />
                          </div>
                          {t.termsAndConditions.sections.contact.email}
                        </a>
                        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300 pt-2 border-t border-gray-100 dark:border-gray-800">
                          <span className="font-bold text-purple">
                            {t.termsAndConditions.sections.contact.labels.support}:
                          </span>
                          {t.termsAndConditions.sections.contact.phone}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Unified Footer Bar */}
        <div className="bg-gray-50 dark:bg-gray-900/50 p-10 md:p-12 text-center border-t border-gray-100 dark:border-gray-800">
          <p className="text-[10px] text-gray-400 dark:text-gray-500 font-black tracking-[0.4em] uppercase mb-8 opacity-60">
            © 2025 Souq Labs Technologies LLC SPC | BuyOrSell.ae | Abu Dhabi,
            UAE
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            {[
              { name: "Terms & Conditions", link: "/terms-and-conditions" },
              { name: "Privacy Policy", link: "/privacy-policy" },
              { name: "Cookies", link: "#cookie-policy" },
              { name: "Safety Center", link: "#" },
            ].map((item) => (
              <Link
                key={item.name}
                href={item.link}
                className="text-[10px] font-black text-gray-400 hover:text-purple transition-all duration-300 uppercase tracking-widest flex items-center gap-2 group"
              >
                <span className="w-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full group-hover:bg-purple group-hover:scale-125 transition-all"></span>
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
