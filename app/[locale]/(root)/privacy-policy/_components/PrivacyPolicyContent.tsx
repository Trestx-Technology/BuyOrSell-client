"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import { useLocale } from "@/hooks/useLocale";

export function PrivacyPolicyContent() {
  const { t } = useLocale();
  const [activeSection, setActiveSection] = useState("glance");

  const sections = [
    { title: t.privacyPolicy.sections.glance.title, id: "glance" },
    { title: t.privacyPolicy.sections.whoWeAre.title, id: "who-we-are" },
    { title: t.privacyPolicy.sections.scope.title, id: "scope" },
    { title: t.privacyPolicy.sections.dataWeCollect.title, id: "data-we-collect" },
    { title: t.privacyPolicy.sections.howWeUse.title, id: "how-we-use" },
    { title: t.privacyPolicy.sections.howWeShare.title, id: "how-we-share" },
    { title: t.privacyPolicy.sections.transfers.title, id: "international-transfers" },
    { title: t.privacyPolicy.sections.retention.title, id: "data-retention" },
    { title: t.privacyPolicy.sections.security.title, id: "how-we-protect" },
    { title: t.privacyPolicy.sections.yourRights.title, id: "your-rights" },
    { title: t.privacyPolicy.sections.cookies.title, id: "cookies" },
    { title: t.privacyPolicy.sections.children.title, id: "children" },
    { title: t.privacyPolicy.sections.thirdParty.title, id: "third-party" },
    { title: t.privacyPolicy.sections.changes.title, id: "changes" },
    { title: t.privacyPolicy.sections.contact.title, id: "contact" },
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

  const SectionHeading = ({
    children,
    id,
  }: {
    children: React.ReactNode;
    id: string;
  }) => (
    <div id={id} className="scroll-mt-24 mb-6">
      <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
        {children}
      </h2>
      <div className="w-12 h-1 bg-purple/20 rounded-full"></div>
    </div>
  );

  const SubHeading = ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mt-8 mb-4">
      {children}
    </h3>
  );

  const Paragraph = ({ children }: { children: React.ReactNode }) => (
    <p className="text-sm leading-relaxed mb-4 text-gray-600 dark:text-gray-300">
      {children}
    </p>
  );

  const List = ({ children }: { children: React.ReactNode }) => (
    <ul className="list-disc list-inside space-y-2 mb-6 text-sm text-gray-600 dark:text-gray-300 ml-2">
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
    <div className="overflow-x-auto mb-8 rounded-xl border border-gray-200 dark:border-gray-800">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-200">
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="px-4 py-3 font-semibold">
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
                <td key={j} className="px-4 py-3">
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
        {/* Header */}
        <div className="text-center py-16 px-6 bg-gradient-to-b from-purple/10 to-transparent rounded-t-[2.5rem]">
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
            {t.privacyPolicy.title}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            {t.privacyPolicy.subtitle}
          </p>
          <div className="mt-8 flex justify-center gap-4 text-xs font-bold text-gray-400">
            <span className="bg-white dark:bg-gray-800 py-2 px-4 rounded-full shadow-sm">
              {t.privacyPolicy.lastUpdated}
            </span>
            <span className="bg-white dark:bg-gray-800 py-2 px-4 rounded-full shadow-sm">
              {t.privacyPolicy.effective}
            </span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row p-6 md:p-12 lg:p-16 gap-12">
          {/* Table of Contents Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 space-y-8">
              <div className="relative">
                <div className="absolute left-[7px] top-10 bottom-0 w-[1px] bg-gray-100 dark:bg-gray-800"></div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-purple/40 mb-6 px-4">
                  {t.privacyPolicy.navigation}
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
                  {t.privacyPolicy.assistance.title}
                </h4>
                <p className="text-[9px] text-purple/60 leading-relaxed relative z-10">
                  {t.privacyPolicy.assistance.description}
                </p>
                <div className="mt-4 flex items-center gap-2 relative z-10">
                  <a
                    href="mailto:contact@buyorsell.ae"
                    className="text-[9px] font-black text-purple hover:underline uppercase tracking-widest transition-all hover:tracking-[0.2em] flex items-center gap-1"
                  >
                    <Mail className="w-3 h-3" /> {t.privacyPolicy.assistance.emailSupport}
                  </a>
                </div>
              </div>
            </div>
          </aside>

          {/* Content Area */}
          <div className="flex-1 min-w-0 space-y-16">
            <section>
              <SectionHeading id="glance">{t.privacyPolicy.sections.glance.title}</SectionHeading>
              <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
                <List>
                  <li>
                    {t.privacyPolicy.sections.glance.items.collect}
                  </li>
                  <li>
                    {t.privacyPolicy.sections.glance.items.why}
                  </li>
                  <li>
                    {t.privacyPolicy.sections.glance.items.share}
                  </li>
                  <li>
                    {t.privacyPolicy.sections.glance.items.rights}
                  </li>
                  <li>
                    {t.privacyPolicy.sections.glance.items.contact}
                  </li>
                </List>
              </div>
            </section>

            <section>
              <SectionHeading id="who-we-are">{t.privacyPolicy.sections.whoWeAre.title}</SectionHeading>
              {t.privacyPolicy.sections.whoWeAre.content.map((p: string, i: number) => (
                <Paragraph key={i}>{p}</Paragraph>
              ))}
            </section>

            <section>
              <SectionHeading id="scope">
                {t.privacyPolicy.sections.scope.title}
              </SectionHeading>
              <Paragraph>{t.privacyPolicy.sections.scope.intro}</Paragraph>
              <List>
                {t.privacyPolicy.sections.scope.items.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </List>
              <Paragraph>
                {t.privacyPolicy.sections.scope.outro}
              </Paragraph>
            </section>

            <section>
              <SectionHeading id="data-we-collect">
                {t.privacyPolicy.sections.dataWeCollect.title}
              </SectionHeading>
              <Paragraph>
                {t.privacyPolicy.sections.dataWeCollect.intro}
              </Paragraph>

              <SubHeading>{t.privacyPolicy.sections.dataWeCollect.direct.title}</SubHeading>
              <Table
                headers={t.privacyPolicy.sections.dataWeCollect.direct.table.headers}
                rows={t.privacyPolicy.sections.dataWeCollect.direct.table.rows}
              />

              <SubHeading>{t.privacyPolicy.sections.dataWeCollect.automatic.title}</SubHeading>
              <Paragraph>
                {t.privacyPolicy.sections.dataWeCollect.automatic.intro}
              </Paragraph>
              <List>
                {t.privacyPolicy.sections.dataWeCollect.automatic.items.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </List>

              <SubHeading>{t.privacyPolicy.sections.dataWeCollect.thirdParty.title}</SubHeading>
              <List>
                {t.privacyPolicy.sections.dataWeCollect.thirdParty.items.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </List>
            </section>

            <section>
              <SectionHeading id="how-we-use">
                4. How We Use Your Personal Data
              </SectionHeading>
              <Paragraph>
                We process your personal data only where we have a lawful basis
                to do so under the PDPL and applicable UAE law. The table below
                sets out our processing activities and the lawful basis for
                each.
              </Paragraph>
              <Table
                headers={["Purpose", "Data Used", "Lawful Basis"]}
                rows={[
                  [
                    "Create and manage your account",
                    "Name, email, phone, password",
                    "Performance of contract",
                  ],
                  [
                    "Display and manage your listings",
                    "Listing content, photos, contact details",
                    "Performance of contract",
                  ],
                  [
                    "Process payments and subscriptions",
                    "Payment info, billing address, transaction history",
                    "Performance of contract",
                  ],
                  [
                    "Provide customer support",
                    "Communications, account info, transaction data",
                    "Performance of contract / Legitimate interests",
                  ],
                  [
                    "Prevent fraud, abuse, and illegal activity",
                    "Device data, IP address, usage logs, identity data",
                    "Legitimate interests / Legal obligation",
                  ],
                  [
                    "Verify user identity and business licences",
                    "Identity documents, licence numbers",
                    "Legal obligation / Legitimate interests",
                  ],
                  [
                    "Improve Platform features and performance",
                    "Usage data, analytics, device data",
                    "Legitimate interests",
                  ],
                  [
                    "Personalise your experience",
                    "Search history, preferences, viewing behaviour",
                    "Consent / Legitimate interests",
                  ],
                  [
                    "Send transactional notifications",
                    "Email, phone, in-app: billing, security alerts, listing updates",
                    "Performance of contract / Legitimate interests",
                  ],
                  [
                    "Send marketing communications",
                    "Email, push notifications: new features, promotions, listings",
                    "Consent",
                  ],
                  [
                    "Conduct analytics and research",
                    "Aggregated and anonymised usage data",
                    "Legitimate interests",
                  ],
                  [
                    "Comply with legal obligations",
                    "Any data required by applicable law or authority",
                    "Legal obligation",
                  ],
                  [
                    "Enforce our Terms and Conditions",
                    "Account data, communications, behaviour logs",
                    "Legitimate interests / Legal obligation",
                  ],
                ]}
              />
              <Paragraph>
                <strong>Marketing opt-out:</strong> You may unsubscribe from
                marketing emails at any time by clicking "Unsubscribe" in any
                marketing email, or by updating your notification preferences in
                Account Settings &rarr; Notifications.
              </Paragraph>
            </section>

            <section>
              <SectionHeading id="how-we-share">
                {t.privacyPolicy.sections.howWeShare.title}
              </SectionHeading>
              <Paragraph>
                {t.privacyPolicy.sections.howWeShare.intro}
              </Paragraph>

              <SubHeading>{t.privacyPolicy.sections.howWeShare.visible.title}</SubHeading>
              <Paragraph>
                {t.privacyPolicy.sections.howWeShare.visible.intro}
              </Paragraph>
              <List>
                {t.privacyPolicy.sections.howWeShare.visible.items.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </List>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700/50 p-4 rounded-xl mb-6">
                <p className="text-sm text-yellow-800 dark:text-yellow-200 px-2 flex gap-4">
                  <span>
                    <strong>⚠️ Caution:</strong> {t.privacyPolicy.sections.howWeShare.visible.caution}
                  </span>
                </p>
              </div>

              <SubHeading>{t.privacyPolicy.sections.howWeShare.serviceProviders.title}</SubHeading>
              <Paragraph>
                {t.privacyPolicy.sections.howWeShare.serviceProviders.intro}
              </Paragraph>
              <Table
                headers={t.privacyPolicy.sections.howWeShare.serviceProviders.table.headers}
                rows={t.privacyPolicy.sections.howWeShare.serviceProviders.table.rows}
              />

              <SubHeading>{t.privacyPolicy.sections.howWeShare.legal.title}</SubHeading>
              <Paragraph>
                {t.privacyPolicy.sections.howWeShare.legal.intro}
              </Paragraph>
              <List>
                {t.privacyPolicy.sections.howWeShare.legal.items.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </List>

              <SubHeading>{t.privacyPolicy.sections.howWeShare.business.title}</SubHeading>
              <Paragraph>
                {t.privacyPolicy.sections.howWeShare.business.content}
              </Paragraph>
            </section>

            <section>
              <SectionHeading id="international-transfers">
                {t.privacyPolicy.sections.transfers.title}
              </SectionHeading>
              {t.privacyPolicy.sections.transfers.content.map((p: string, i: number) => (
                <Paragraph key={i}>{p}</Paragraph>
              ))}
              <List>
                {t.privacyPolicy.sections.transfers.items.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </List>
              <Paragraph>
                {t.privacyPolicy.sections.transfers.outro}
              </Paragraph>
            </section>

            <section>
              <SectionHeading id="data-retention">
                {t.privacyPolicy.sections.retention.title}
              </SectionHeading>
              <Paragraph>
                {t.privacyPolicy.sections.retention.intro}
              </Paragraph>
              <Table
                headers={t.privacyPolicy.sections.retention.table.headers}
                rows={t.privacyPolicy.sections.retention.table.rows}
              />
              <Paragraph>
                {t.privacyPolicy.sections.retention.outro}
              </Paragraph>
            </section>

            <section>
              <SectionHeading id="how-we-protect">
                {t.privacyPolicy.sections.security.title}
              </SectionHeading>
              <Paragraph>
                {t.privacyPolicy.sections.security.intro}
              </Paragraph>
              <List>
                {t.privacyPolicy.sections.security.items.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </List>
            </section>

            <section>
              <SectionHeading id="your-rights">
                {t.privacyPolicy.sections.yourRights.title}
              </SectionHeading>
              <Paragraph>
                {t.privacyPolicy.sections.yourRights.intro}
              </Paragraph>
              <Table
                headers={t.privacyPolicy.sections.yourRights.table.headers}
                rows={t.privacyPolicy.sections.yourRights.table.rows}
              />
              <Paragraph>
                <strong>{t.privacyPolicy.sections.yourRights.outro.split(":")[0]}:</strong>
                {t.privacyPolicy.sections.yourRights.outro.split(":")[1]}
              </Paragraph>
              <Paragraph>
                <strong>{t.privacyPolicy.sections.yourRights.accountSelfService.split(":")[0]}:</strong>
                {t.privacyPolicy.sections.yourRights.accountSelfService.split(":")[1]}
              </Paragraph>
            </section>

            <section>
              <SectionHeading id="cookies">
                {t.privacyPolicy.sections.cookies.title}
              </SectionHeading>
              <Paragraph>
                {t.privacyPolicy.sections.cookies.intro}
              </Paragraph>
              <Paragraph>
                {t.privacyPolicy.sections.cookies.outro}
              </Paragraph>
            </section>

            <section>
              <SectionHeading id="children">
                {t.privacyPolicy.sections.children.title}
              </SectionHeading>
              <Paragraph>
                {t.privacyPolicy.sections.children.intro}
              </Paragraph>
              <Paragraph>
                {t.privacyPolicy.sections.children.middle}
              </Paragraph>
              <Paragraph>
                {t.privacyPolicy.sections.children.outro}
              </Paragraph>
              <Paragraph>
                {t.privacyPolicy.sections.children.compliance}
              </Paragraph>
            </section>

            <section>
              <SectionHeading id="third-party">
                {t.privacyPolicy.sections.thirdParty.title}
              </SectionHeading>
              <Paragraph>
                {t.privacyPolicy.sections.thirdParty.intro}
              </Paragraph>
              <Paragraph>
                {t.privacyPolicy.sections.thirdParty.middle}
              </Paragraph>
              <Paragraph>
                {t.privacyPolicy.sections.thirdParty.outro}
              </Paragraph>
            </section>

            <section>
              <SectionHeading id="changes">
                {t.privacyPolicy.sections.changes.title}
              </SectionHeading>
              <Paragraph>
                {t.privacyPolicy.sections.changes.intro}
              </Paragraph>
              <List>
                {t.privacyPolicy.sections.changes.items.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </List>
              <Paragraph>
                {t.privacyPolicy.sections.changes.outro}
              </Paragraph>
            </section>

            <section>
              <SectionHeading id="contact"> {t.privacyPolicy.sections.contact.title}</SectionHeading>
              <Paragraph>
                {t.privacyPolicy.sections.contact.intro}
              </Paragraph>
              <div className="bg-gray-50 dark:bg-gray-800/80 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
                <p className="font-bold mb-2">
                  {t.privacyPolicy.sections.contact.dpo}
                </p>
                <p className="text-sm">
                  {t.privacyPolicy.sections.contact.company}
                </p>
                <p className="text-sm flex items-center gap-2 mt-2">
                  <MapPin className="w-4 h-4 text-purple" /> {t.privacyPolicy.sections.contact.address}
                </p>
                <p className="text-sm flex items-center gap-2 mt-2">
                  <Mail className="w-4 h-4 text-purple" /> {t.privacyPolicy.sections.contact.email}
                </p>
                <p className="text-sm mt-2">
                  {t.privacyPolicy.sections.contact.support}
                </p>
                <p className="text-sm mt-2">{t.privacyPolicy.sections.contact.phone}</p>
                <p className="text-sm italic text-gray-500 mt-4">
                  {t.privacyPolicy.sections.contact.responseTime}
                </p>
              </div>
            </section>
          </div>
        </div>

        {/* Footer info box */}
        <div className="bg-gray-50 dark:bg-gray-900/50 p-8 md:p-12 text-center border-t border-gray-100 dark:border-gray-800 rounded-b-[2.5rem]">
          <p className="text-[10px] text-gray-400 dark:text-gray-500 font-inter tracking-[0.3em] uppercase mb-6">
            © 2025 Souq Labs Technologies LLC SPC | BuyOrSell.ae
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link
              href="/terms-and-conditions"
              className="text-[10px] font-bold text-gray-400 hover:text-purple transition-colors flex items-center gap-2"
            >
              <span className="w-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full"></span>
              Terms & Conditions
            </Link>
            <Link
              href="/privacy-policy"
              className="text-[10px] font-bold text-gray-400 hover:text-purple transition-colors flex items-center gap-2"
            >
              <span className="w-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full"></span>
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
