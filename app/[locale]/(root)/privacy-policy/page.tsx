"use client"
import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { Mail, MapPin } from "lucide-react";

const sections = [
  { title: "Privacy at a Glance", id: "glance" },
  { title: "1. Who We Are", id: "who-we-are" },
  { title: "2. Scope of This Policy", id: "scope" },
  { title: "3. Personal Data We Collect", id: "data-we-collect" },
  { title: "4. How We Use Your Data", id: "how-we-use" },
  { title: "5. How We Share Your Data", id: "how-we-share" },
  { title: "6. International Transfers", id: "international-transfers" },
  { title: "7. Data Retention", id: "data-retention" },
  { title: "8. How We Protect Your Data", id: "how-we-protect" },
  { title: "9. Your Data Rights", id: "your-rights" },
  { title: "10. Cookies & Tracking", id: "cookies" },
  { title: "11. Children's Privacy", id: "children" },
  { title: "12. Third-Party Services", id: "third-party" },
  { title: "13. Changes to Policy", id: "changes" },
  { title: "14. Contact Us", id: "contact" },
];

function PrivacyPolicyContent() {
  const [activeSection, setActiveSection] = useState("glance");

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
  }, [activeSection]);

  const SectionHeading = ({ children, id }: { children: React.ReactNode, id: string }) => (
    <div id={id} className="scroll-mt-24 mb-6">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">{children}</h2>
        <div className="w-12 h-1 bg-purple/20 rounded-full"></div>
    </div>
  );

  const SubHeading = ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mt-8 mb-4">{children}</h3>
  );

  const Paragraph = ({ children }: { children: React.ReactNode }) => (
    <p className="text-sm leading-relaxed mb-4 text-gray-600 dark:text-gray-300">{children}</p>
  );

  const List = ({ children }: { children: React.ReactNode }) => (
    <ul className="list-disc list-inside space-y-2 mb-6 text-sm text-gray-600 dark:text-gray-300 ml-2">
      {children}
    </ul>
  );
  
  const Table = ({ headers, rows }: { headers: string[], rows: string[][] }) => (
    <div className="overflow-x-auto mb-8 rounded-xl border border-gray-200 dark:border-gray-800">
        <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-200">
                <tr>
                    {headers.map((h, i) => <th key={i} className="px-4 py-3 font-semibold">{h}</th>)}
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {rows.map((row, i) => (
                    <tr key={i} className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        {row.map((cell, j) => <td key={j} className="px-4 py-3">{cell}</td>)}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  );

  return (
    <div className="bg-gray-50 dark:bg-[#0B0F19] min-h-screen py-10 px-4 md:px-8 lg:px-12 font-inter shadow-inner scroll-smooth">
      <div className="max-w-6xl mx-auto bg-white dark:bg-[#121827] shadow-2xl rounded-[2.5rem] mt-10 mb-20 border border-gray-100 dark:border-gray-800">
        
        {/* Header */}
        <div className="text-center py-16 px-6 bg-gradient-to-b from-purple/10 to-transparent rounded-t-[2.5rem]">
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">BuyOrSell.ae Privacy Policy</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">How We Collect, Use, and Protect Your Personal Data</p>
            <div className="mt-8 flex justify-center gap-4 text-xs font-bold text-gray-400">
                <span className="bg-white dark:bg-gray-800 py-2 px-4 rounded-full shadow-sm">Last Updated: February 2025</span>
                <span className="bg-white dark:bg-gray-800 py-2 px-4 rounded-full shadow-sm">Effective: February 2025</span>
            </div>
        </div>

        <div className="flex flex-col lg:flex-row p-6 md:p-12 lg:p-16 gap-12">
            {/* Table of Contents Sidebar */}
            <aside className="hidden lg:block w-64 shrink-0">
                  <div className="sticky top-24 space-y-8">
                        <div className="relative">
                              <div className="absolute left-[7px] top-10 bottom-0 w-[1px] bg-gray-100 dark:bg-gray-800"></div>
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
                                                                  ? "text-purple translate-x-1 bg-purple/5"
                                                                  : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                                            }`}
                                                >
                                                      <div className={`w-[3px] h-3 rounded-full mr-3 transition-all duration-500 scale-y-0 opacity-0 ${isActive
                                                                  ? "bg-purple scale-y-100 opacity-100 shadow-[0_0_8px_rgba(111,44,242,0.6)]"
                                                                  : "bg-gray-200 dark:bg-gray-700"
                                                            }`}></div>
                                                      <span className={`transition-all duration-300 ${isActive ? "opacity-100" : "opacity-70 group-hover:opacity-100"}`}>
                                                            {section.title}
                                                      </span>
                                                </Link>
                                          );
                                    })}
                              </nav>
                        </div>

                        <div className="p-6 bg-purple/5 dark:bg-purple/10 border border-purple/10 rounded-[2rem] relative overflow-hidden group hover:border-purple/30 transition-colors">
                              <h4 className="text-xs font-black text-purple mb-1 relative z-10">Assistance</h4>
                              <p className="text-[9px] text-purple/60 leading-relaxed relative z-10">
                                    Questions about our privacy policy? We are here to help.
                              </p>
                              <div className="mt-4 flex items-center gap-2 relative z-10">
                                    <a href="mailto:contact@buyorsell.ae" className="text-[9px] font-black text-purple hover:underline uppercase tracking-widest transition-all hover:tracking-[0.2em] flex items-center gap-1">
                                        <Mail className="w-3 h-3" /> Email Support
                                    </a>
                              </div>
                        </div>
                  </div>
            </aside>

            {/* Content Area */}
            <div className="flex-1 min-w-0 space-y-16">
                
                <section>
                    <SectionHeading id="glance">Privacy at a Glance</SectionHeading>
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
                        <List>
                            <li><strong>What we collect:</strong> Name, contact details, listing data, payment info, device/usage data.</li>
                            <li><strong>Why:</strong> To operate the Platform, process payments, prevent fraud, improve our service, and (with consent) send marketing.</li>
                            <li><strong>Who we share with:</strong> Payment processors (Stripe), analytics (Google), ad partners (Meta, Bing), hosting providers - all under strict data agreements.</li>
                            <li><strong>Your rights:</strong> Access, correct, delete, restrict, object, and port your data. Withdraw consent anytime.</li>
                            <li><strong>Contact:</strong> contact@buyorsell.ae</li>
                        </List>
                    </div>
                </section>

                <section>
                    <SectionHeading id="who-we-are">1. Who We Are</SectionHeading>
                    <Paragraph>
                        Souq Labs Technologies LLC SPC ("BuyOrSell", "we", "us", "our") operates the online classifieds platform at www.buyorsell.ae, registered in Abu Dhabi, United Arab Emirates. We are the data controller for personal data processed through the Platform.
                    </Paragraph>
                    <Paragraph>
                        This Privacy Policy explains how we collect, use, share, retain, and protect your personal data when you access or use the Platform, and describes your rights under the UAE Federal Decree-Law No. 45/2021 on Personal Data Protection ("PDPL") and other applicable privacy laws.
                    </Paragraph>
                    <Paragraph>
                        If you have any questions or concerns, please contact us: contact@buyorsell.ae.
                    </Paragraph>
                </section>

                <section>
                    <SectionHeading id="scope">2. Scope of This Policy</SectionHeading>
                    <Paragraph>This Policy applies to:</Paragraph>
                    <List>
                        <li>All users of the Platform, including visitors, registered account holders, buyers, sellers, landlords, tenants, employers, job seekers, and business users.</li>
                        <li>Personal data collected through the website at www.buyorsell.ae, our mobile applications, and any related services.</li>
                        <li>Data collected via communications with us (email, phone, in-app messaging, support tickets).</li>
                    </List>
                    <Paragraph>
                        This Policy does not apply to third-party websites, applications, or services linked from the Platform. We encourage you to read the privacy policies of any third-party services you use.
                    </Paragraph>
                </section>

                <section>
                    <SectionHeading id="data-we-collect">3. Personal Data We Collect</SectionHeading>
                    <Paragraph>We collect personal data in three main ways: data you provide to us directly, data collected automatically, and data received from third parties.</Paragraph>
                    
                    <SubHeading>3.1 Data You Provide Directly</SubHeading>
                    <Table 
                        headers={["Category", "Examples", "When Collected"]}
                        rows={[
                            ["Account Information", "Full name, email address, mobile number, password (hashed), profile photo", "Registration and account updates"],
                            ["Identity & Verification", "Emirates ID number, trade licence number, RERA/real estate licence (for business users)", "Verification requests"],
                            ["Listing Content", "Item descriptions, photos, videos, pricing, category, location (emirate/area)", "Creating or editing a listing"],
                            ["Payment Information", "Credit/debit card details (tokenised via Stripe), billing address, transaction history", "Purchasing a subscription or paid feature"],
                            ["Communications", "Messages sent via in-platform messaging, email, or support tickets", "Contacting sellers/buyers or our support team"],
                            ["Reviews & Ratings", "Rating scores, written reviews of other users", "Submitting a review"],
                            ["Job Applications & CVs", "Work history, education, skills, references (if uploaded)", "Using the Jobs section"],
                            ["Business Profile", "Business name, logo, website URL, business description", "Verified Business Account setup"],
                            ["Preferences & Settings", "Language preference (Arabic/English), notification settings, saved searches", "Adjusting account settings"]
                        ]}
                    />

                    <SubHeading>3.2 Data Collected Automatically</SubHeading>
                    <Paragraph>When you use the Platform, we automatically collect technical and usage data, including:</Paragraph>
                    <List>
                        <li><strong>Device data:</strong> IP address, device type, operating system, browser type and version, screen resolution.</li>
                        <li><strong>Usage data:</strong> Pages visited, listings viewed, search queries, filters applied, time spent on pages, click patterns, and referral URLs.</li>
                        <li><strong>Location data:</strong> General location inferred from IP address (emirate level). We do not collect precise GPS location unless you explicitly grant permission for location-based features.</li>
                        <li><strong>Cookie and tracking data:</strong> Session identifiers, analytics identifiers, advertising identifiers. See Section 10 (Cookie Policy) for full details.</li>
                        <li><strong>Transaction logs:</strong> Subscription purchases, renewal dates, payment status, and refund requests.</li>
                    </List>

                    <SubHeading>3.3 Data Received from Third Parties</SubHeading>
                    <List>
                        <li><strong>Social login providers:</strong> If you register or log in using Google or Apple, we receive your name, email address, and profile photo from those services.</li>
                        <li><strong>Payment processors:</strong> Stripe may share transaction confirmation, fraud risk scores, and card verification status.</li>
                        <li><strong>Advertising partners:</strong> Google Ads and Meta may share audience segment data for ad targeting and measurement.</li>
                        <li><strong>Verification services:</strong> Where we use third-party identity or licence verification services, we receive confirmation results.</li>
                    </List>
                </section>

                <section>
                    <SectionHeading id="how-we-use">4. How We Use Your Personal Data</SectionHeading>
                    <Paragraph>We process your personal data only where we have a lawful basis to do so under the PDPL and applicable UAE law. The table below sets out our processing activities and the lawful basis for each.</Paragraph>
                    <Table 
                        headers={["Purpose", "Data Used", "Lawful Basis"]}
                        rows={[
                            ["Create and manage your account", "Name, email, phone, password", "Performance of contract"],
                            ["Display and manage your listings", "Listing content, photos, contact details", "Performance of contract"],
                            ["Process payments and subscriptions", "Payment info, billing address, transaction history", "Performance of contract"],
                            ["Provide customer support", "Communications, account info, transaction data", "Performance of contract / Legitimate interests"],
                            ["Prevent fraud, abuse, and illegal activity", "Device data, IP address, usage logs, identity data", "Legitimate interests / Legal obligation"],
                            ["Verify user identity and business licences", "Identity documents, licence numbers", "Legal obligation / Legitimate interests"],
                            ["Improve Platform features and performance", "Usage data, analytics, device data", "Legitimate interests"],
                            ["Personalise your experience", "Search history, preferences, viewing behaviour", "Consent / Legitimate interests"],
                            ["Send transactional notifications", "Email, phone, in-app: billing, security alerts, listing updates", "Performance of contract / Legitimate interests"],
                            ["Send marketing communications", "Email, push notifications: new features, promotions, listings", "Consent"],
                            ["Conduct analytics and research", "Aggregated and anonymised usage data", "Legitimate interests"],
                            ["Comply with legal obligations", "Any data required by applicable law or authority", "Legal obligation"],
                            ["Enforce our Terms and Conditions", "Account data, communications, behaviour logs", "Legitimate interests / Legal obligation"]
                        ]}
                    />
                    <Paragraph><strong>Marketing opt-out:</strong> You may unsubscribe from marketing emails at any time by clicking "Unsubscribe" in any marketing email, or by updating your notification preferences in Account Settings &rarr; Notifications.</Paragraph>
                </section>

                <section>
                    <SectionHeading id="how-we-share">5. How We Share Your Personal Data</SectionHeading>
                    <Paragraph>We do not sell your personal data to third parties. We share data only as described below.</Paragraph>
                    
                    <SubHeading>5.1 Visible to Other Users</SubHeading>
                    <Paragraph>Certain data is inherently visible to other Platform users as part of the classifieds service:</Paragraph>
                    <List>
                        <li>Your display name, profile photo (if set), general location (emirate), and listing content.</li>
                        <li>Your review submissions (attributed to your display name).</li>
                        <li>Business users: Business name, logo, website, and verified status badge.</li>
                    </List>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700/50 p-4 rounded-xl mb-6">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200 px-2 flex gap-4">
                            <span><strong>⚠️ Caution:</strong> Do not include sensitive personal information (e.g., full address, bank details, Emirates ID number) in listing descriptions, photos, or messages. We cannot protect data you share publicly.</span>
                        </p>
                    </div>

                    <SubHeading>5.2 Service Providers</SubHeading>
                    <Paragraph>We share data with trusted third-party service providers who process data on our behalf, under strict data processing agreements:</Paragraph>
                    <Table 
                        headers={["Provider", "Category", "Data Shared"]}
                        rows={[
                            ["Stripe", "Payment Processing", "Billing details, transaction amounts, fraud signals"],
                            ["Google Cloud / AWS", "Cloud Hosting & Storage", "All Platform data (encrypted at rest and in transit)"],
                            ["Google Analytics", "Analytics", "Anonymised usage data, IP (truncated), device info"],
                            ["Google Ads", "Advertising", "Hashed email (for matching), ad interactions"],
                            ["Meta (Facebook)", "Advertising", "Pixel data, hashed email (for Custom Audiences)"],
                            ["Microsoft Bing Ads", "Advertising", "UET tag data for conversion tracking"],
                            ["SendGrid / Twilio", "Email & SMS", "Email address, phone number for transactional messages"],
                            ["Firebase (Google)", "Push Notifications", "Device token, notification content"],
                            ["Sentry / Datadog", "Error Monitoring", "Anonymised error logs, device/OS data"],
                            ["Google My Business", "Social Media", "Business profile data, reviews, user interactions"],
                            ["Threads", "Social Media", "Profile data, post interactions, engagement metrics"],
                            ["YouTube", "Social Media / Video", "Video interaction data, hashed email, ad performance data"],
                            ["Facebook", "Social Media", "Pixel data, hashed email, social interactions, ad targeting data"],
                            ["Instagram", "Social Media", "Pixel data, hashed email, photo/video interactions, ad metrics"],
                            ["X (Twitter)", "Social Media", "Hashed email, tweet interactions, ad conversion data"],
                            ["Snapchat", "Social Media", "Snap Pixel data, hashed email, ad engagement metrics"],
                            ["TikTok", "Social Media / Video", "TikTok Pixel data, hashed email, video engagement data"],
                            ["Telegram", "Messaging / Social", "Username, notification opt-in status, channel interaction data"],
                            ["WhatsApp", "Messaging", "Phone number, message delivery status, opt-in consent data"],
                            ["LinkedIn", "Social Media / Professional", "Hashed email, LinkedIn Insight Tag data, ad conversion metrics"]
                        ]}
                    />

                    <SubHeading>5.3 Legal Disclosures</SubHeading>
                    <Paragraph>We may disclose your personal data to government authorities, regulators, law enforcement agencies, or courts where we are required or permitted to do so by applicable UAE law, including:</Paragraph>
                    <List>
                        <li>To comply with a legal obligation, court order, or regulatory requirement.</li>
                        <li>To protect the rights, property, or safety of BuyOrSell, our users, or the public.</li>
                        <li>To investigate or prevent fraud, illegal activity, or violations of our Terms.</li>
                    </List>

                    <SubHeading>5.4 Business Transfers</SubHeading>
                    <Paragraph>If we are involved in a merger, acquisition, restructuring, or sale of assets, your personal data may be transferred as part of that transaction. We will notify you via email or prominent notice on the Platform before your data is transferred and becomes subject to a different privacy policy.</Paragraph>
                </section>

                <section>
                    <SectionHeading id="international-transfers">6. International Data Transfers</SectionHeading>
                    <Paragraph>The Platform is operated from the UAE, and your data is primarily stored on UAE-based servers. Some of our service providers (including Google, Meta, Stripe, and Twilio) may process your data in data centres located outside the UAE, including in the European Union, United States, and other countries.</Paragraph>
                    <Paragraph>When we transfer personal data internationally, we ensure appropriate safeguards are in place, including:</Paragraph>
                    <List>
                        <li>Standard Contractual Clauses (SCCs) approved by relevant data protection authorities.</li>
                        <li>Adequacy decisions where the destination country offers equivalent protection.</li>
                        <li>Binding corporate rules where applicable for intra-group transfers.</li>
                    </List>
                    <Paragraph>You may request information about the safeguards we use for international transfers by contacting us at the details in Section 14.</Paragraph>
                </section>

                <section>
                    <SectionHeading id="data-retention">7. Data Retention</SectionHeading>
                    <Paragraph>We retain your personal data only for as long as necessary to fulfil the purposes described in this Policy, or as required by applicable law. The table below summarises our key retention periods.</Paragraph>
                    <Table 
                        headers={["Data Category", "Retention Period", "Reason"]}
                        rows={[
                            ["Active account data", "Duration of account + 1 year", "Service delivery and legal compliance"],
                            ["Listing content", "Duration of listing + 6 months", "Dispute resolution and audit"],
                            ["Payment and transaction records", "7 years", "UAE tax and financial law requirements"],
                            ["Communication logs (support)", "3 years", "Dispute resolution"],
                            ["In-platform messages between users", "2 years from last activity", "Fraud investigation"],
                            ["Identity/licence verification docs", "5 years", "UAE regulatory requirements"],
                            ["Analytics data (aggregated)", "Up to 26 months (Google Analytics default)", "Platform improvement"],
                            ["Marketing consent records", "5 years from consent", "Proof of consent"],
                            ["Deleted account data", "90 days (then permanently deleted)", "Account recovery window"]
                        ]}
                    />
                    <Paragraph>After the applicable retention period, we will securely delete or anonymise your personal data. Where anonymisation is not possible, we will restrict processing until deletion is feasible.</Paragraph>
                </section>

                <section>
                    <SectionHeading id="how-we-protect">8. How We Protect Your Data</SectionHeading>
                    <Paragraph>We implement appropriate technical and organisational security measures to protect your personal data against unauthorised access, alteration, disclosure, destruction, or accidental loss. Our security measures include:</Paragraph>
                    <List>
                        <li><strong>Encryption in transit:</strong> All data transmitted between your device and our servers is protected using TLS 1.2+ (HTTPS).</li>
                        <li><strong>Encryption at rest:</strong> Sensitive data, including payment information and identity documents, is encrypted at rest using AES-256 encryption.</li>
                        <li><strong>Password security:</strong> User passwords are hashed using industry-standard one-way algorithms (bcrypt). We do not store plain-text passwords.</li>
                        <li><strong>Access controls:</strong> Access to personal data is restricted to authorised employees and contractors who need it to perform their duties, subject to confidentiality obligations.</li>
                        <li><strong>Two-factor authentication (2FA):</strong> Available for all accounts and strongly recommended.</li>
                        <li><strong>Regular security testing:</strong> We conduct regular vulnerability assessments, penetration testing, and security audits.</li>
                        <li><strong>Incident response:</strong> We maintain a data breach response plan and will notify affected users and the relevant UAE authority within the timeframes required by the PDPL in the event of a significant breach.</li>
                    </List>
                    <Paragraph><strong>Your responsibility:</strong> We cannot guarantee absolute security. You are responsible for keeping your account credentials confidential, using a strong unique password, and notifying us immediately at support@buyorsell.ae if you suspect any unauthorised access to your account.</Paragraph>
                </section>

                <section>
                    <SectionHeading id="your-rights">9. Your Data Protection Rights</SectionHeading>
                    <Paragraph>Under UAE Federal Decree-Law No. 45/2021 (PDPL) and applicable law, you have the following rights in relation to your personal data:</Paragraph>
                    <Table 
                        headers={["Right", "What It Means"]}
                        rows={[
                            ["Right of Access", "Request a copy of the personal data we hold about you, and information about how it is processed."],
                            ["Right to Rectification", "Request correction of inaccurate or incomplete personal data. You can also update most data directly in Account Settings."],
                            ["Right to Erasure", "Request deletion of your personal data where it is no longer necessary, where consent is withdrawn, or where processing is unlawful. Note: some data must be retained by law."],
                            ["Right to Restriction", "Request that we limit processing of your data in certain circumstances (e.g., while accuracy is disputed)."],
                            ["Right to Object", "Object to processing based on legitimate interests (including direct marketing). We will stop unless we demonstrate compelling legitimate grounds."],
                            ["Right to Withdraw Consent", "Withdraw consent at any time for consent-based processing (e.g., marketing). Withdrawal does not affect lawfulness of prior processing."]
                        ]}
                    />
                    <Paragraph><strong>How to exercise your rights:</strong> Submit a request by emailing contact@buyorsell.ae with the subject line "Data Subject Request". We will respond within 7-15 business days of receipt. We may need to verify your identity before processing your request. Some requests may be subject to exemptions under applicable law.</Paragraph>
                    <Paragraph><strong>Account self-service:</strong> Many rights can be exercised directly within the Platform via Account Settings &rarr; Privacy. You can download your data, delete your account, or update your preferences at any time.</Paragraph>
                </section>

                <section>
                    <SectionHeading id="cookies">10. Cookies and Tracking Technologies</SectionHeading>
                    <Paragraph>We use cookies and similar tracking technologies to operate and improve the Platform. For full details, including the types of cookies used, how to manage your preferences, and third-party providers, please refer to our Cookie Policy in Section 14 of our Terms and Conditions, available at www.buyorsell.ae.</Paragraph>
                    <Paragraph><strong>Cookie consent:</strong> On your first visit, we display a consent banner allowing you to accept all cookies, reject non-essential cookies, or manage granular preferences. Essential cookies cannot be disabled as they are required for the Platform to function. You may update your cookie preferences at any time via Account Settings &rarr; Privacy &rarr; Cookie Preferences.</Paragraph>
                </section>

                <section>
                    <SectionHeading id="children">11. Children's Privacy</SectionHeading>
                    <Paragraph>The Platform is intended for users aged 18 and above. We do not knowingly collect personal data from children under the age of 18.</Paragraph>
                    <Paragraph>If we become aware that we have collected personal data from a child under 18 without appropriate parental or guardian consent, we will take immediate steps to delete that data from our systems.</Paragraph>
                    <Paragraph>If you are a parent or guardian and believe your child has provided personal data to us without your consent, please contact us at support@buyorsell.ae so we can take appropriate action.</Paragraph>
                    <Paragraph>We comply with the UAE Child Digital Safety Law and do not serve behavioural advertising to users identified as being under 18.</Paragraph>
                </section>

                <section>
                    <SectionHeading id="third-party">12. Third-Party Websites and Services</SectionHeading>
                    <Paragraph>The Platform may contain links to third-party websites, social media platforms, or services not operated by us (for example, external payment pages, social login providers, or advertiser websites).</Paragraph>
                    <Paragraph>This Privacy Policy does not apply to those third-party services. We are not responsible for the privacy practices or content of any third-party sites. We encourage you to read the privacy policy of each third-party website or service you visit.</Paragraph>
                    <Paragraph>Where you use social login (Google or Apple), the relevant platform's privacy policy also applies to the data they share with us.</Paragraph>
                </section>

                <section>
                    <SectionHeading id="changes">13. Changes to This Privacy Policy</SectionHeading>
                    <Paragraph>We may update this Privacy Policy from time to time to reflect changes in our data practices, technology, or applicable law. We will notify you of material changes by:</Paragraph>
                    <List>
                        <li>Posting the updated Policy on the Platform with a revised "Last Updated" date; and</li>
                        <li>Sending an email notification to your registered email address (for significant changes affecting your rights).</li>
                    </List>
                    <Paragraph>Your continued use of the Platform after the effective date of any changes constitutes your acceptance of the updated Policy. We encourage you to review this Policy periodically.</Paragraph>
                </section>

                <section>
                    <SectionHeading id="contact">14. Contact Us</SectionHeading>
                    <Paragraph>If you have any questions, concerns, or requests regarding this Privacy Policy or how we handle your personal data, please contact us:</Paragraph>
                    <div className="bg-gray-50 dark:bg-gray-800/80 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
                        <p className="font-bold mb-2">Data Protection Officer - BuyOrSell.ae</p>
                        <p className="text-sm">Company: Souq Labs Technologies LLC SPC</p>
                        <p className="text-sm flex items-center gap-2 mt-2"><MapPin className="w-4 h-4 text-purple" /> Registered Address: Abu Dhabi, United Arab Emirates</p>
                        <p className="text-sm flex items-center gap-2 mt-2"><Mail className="w-4 h-4 text-purple" /> Contact Email: <a href="mailto:contact@buyorsell.ae" className="text-purple hover:underline">contact@buyorsell.ae</a></p>
                        <p className="text-sm mt-2">General Support: <a href="mailto:support@buyorsell.ae" className="text-purple hover:underline">support@buyorsell.ae</a></p>
                        <p className="text-sm mt-2">Phone: +971 2 675 6766</p>
                        <p className="text-sm italic text-gray-500 mt-4">Response Time: We will respond to all privacy requests within 7-15 business days.</p>
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
                <Link href="/terms-and-conditions" className="text-[10px] font-bold text-gray-400 hover:text-purple transition-colors flex items-center gap-2">
                    <span className="w-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full"></span>
                    Terms & Conditions
                </Link>
                <Link href="/privacy-policy" className="text-[10px] font-bold text-gray-400 hover:text-purple transition-colors flex items-center gap-2">
                    <span className="w-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full"></span>
                    Privacy Policy
                </Link>
            </div>
        </div>
      </div>
    </div>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center font-inter text-purple animate-pulse">Loading Privacy Policy...</div>}>
      <PrivacyPolicyContent />
    </Suspense>
  );
}
