import { type PrivacyPolicyTranslationNamespace } from "./types";

export const privacyPolicyTranslations: PrivacyPolicyTranslationNamespace = {
  en: {
    title: "BuyOrSell.ae Privacy Policy",
    subtitle: "How We Collect, Use, and Protect Your Personal Data",
    lastUpdated: "Last Updated: February 2025",
    effective: "Effective: February 2025",
    navigation: "Navigation",
    assistance: {
      title: "Need Assistance?",
      description: "If you have questions about this Privacy Policy, our data practices, or your rights, please contact us.",
      emailSupport: "Email Support",
    },
    sections: {
      glance: {
        title: "At a Glance",
        items: {
          collect: "Name, contact details, listing data, payment info, device/usage data.",
          why: "To operate the Platform, process payments, prevent fraud, improve our service, and (with consent) send marketing.",
          share: "Payment processors (Stripe), analytics (Google), ad partners (Meta, Bing), hosting providers — all under strict data agreements.",
          rights: "Access, correct, delete, restrict, object, and port your data. Withdraw consent anytime.",
          contact: "contact@buyorsell.ae",
        },
      },
      whoWeAre: {
        title: "1. Who We Are",
        content: [
          "Souq Labs Technologies LLC SPC (\"BuyOrSell\", \"we\", \"us\", \"our\") operates the online classifieds platform at www.buyorsell.ae, registered in Abu Dhabi, United Arab Emirates. We are the data controller for personal data processed through the Platform.",
          "This Privacy Policy explains how we collect, use, share, retain, and protect your personal data when you access or use the Platform, and describes your rights under the UAE Federal Decree-Law No. 45/2021 on Personal Data Protection (\"PDPL\") and other applicable privacy laws.",
          "If you have any questions or concerns, please contact us: contact@buyorsell.ae.",
        ],
      },
      scope: {
        title: "2. Scope of This Policy",
        intro: "This Policy applies to:",
        items: [
          "All users of the Platform, including visitors, registered account holders, buyers, sellers, landlords, tenants, employers, job seekers, and business users.",
          "Personal data collected through the website at www.buyorsell.ae, our mobile applications, and any related services.",
          "Data collected via communications with us (email, phone, in-app messaging, support tickets).",
        ],
        outro: "This Policy does not apply to third-party websites, applications, or services linked from the Platform. We encourage you to read the privacy policies of any third-party services you use.",
      },
      dataWeCollect: {
        title: "3. Personal Data We Collect",
        intro: "We collect personal data in three main ways: data you provide to us directly, data collected automatically, and data received from third parties.",
        direct: {
          title: "3.1 Data You Provide Directly",
          table: {
            headers: ["Category", "Examples"],
            rows: [
              ["Account Information", "Full name, email address, mobile number, password (hashed), profile photo"],
              ["Identity & Verification", "Emirates ID number, trade licence number, RERA/real estate licence (for business users)"],
              ["Listing Content", "Item descriptions, photos, videos, pricing, category, location (emirate/area)"],
              ["Payment Information", "Credit/debit card details (tokenised via Stripe), billing address, transaction history"],
              ["Communications", "Messages sent via in-platform messaging, email, or support tickets"],
              ["Reviews & Ratings", "Rating scores, written reviews of other users"],
              ["Job Applications & CVs", "Work history, education, skills, references (if uploaded)"],
              ["Business Profile", "Business name, logo, website URL, business description"],
              ["Preferences & Settings", "Language preference (Arabic/English), notification settings, saved searches"],
            ],
          },
        },
        automatic: {
          title: "3.2 Data Collected Automatically",
          intro: "When you use the Platform, we automatically collect technical and usage data, including:",
          items: [
            "Device data: IP address, device type, operating system, browser type and version, screen resolution.",
            "Usage data: Pages visited, listings viewed, search queries, filters applied, time spent on pages, click patterns, and referral URLs.",
            "Location data: General location inferred from IP address (emirate level). We do not collect precise GPS location unless you explicitly grant permission for location-based features.",
            "Cookie and tracking data: Session identifiers, analytics identifiers, advertising identifiers. See Section 10 (Cookie Policy) for full details.",
            "Transaction logs: Subscription purchases, renewal dates, payment status, and refund requests.",
          ],
        },
        thirdParty: {
          title: "3.3 Data Received from Third Parties",
          items: [
            "Social login providers: If you register or log in using Google or Apple, we receive your name, email address, and profile photo from those services.",
            "Payment processors: Stripe may share transaction confirmation, fraud risk scores, and card verification status.",
            "Advertising partners: Google Ads and Meta may share audience segment data for ad targeting and measurement.",
            "Verification services: Where we use third-party identity or licence verification services, we receive confirmation results.",
          ],
        },
      },
      howWeUse: {
        title: "4. How We Use Your Personal Data",
        intro: "We process your personal data only where we have a lawful basis to do so under the PDPL and applicable UAE law. The table below sets out our processing activities and the lawful basis for each.",
        table: {
          headers: ["Purpose", "Lawful Basis"],
          rows: [
            ["Account Management", "Performance of contract"],
            ["Display Listings", "Performance of contract"],
            ["Payments & Subscriptions", "Performance of contract"],
            ["Customer Support", "Performance of contract / Legitimate interests"],
            ["Fraud Prevention", "Legitimate interests / Legal obligation"],
            ["Identity Verification", "Legal obligation / Legitimate interests"],
            ["Platform Improvement", "Legitimate interests"],
            ["Personalisation", "Consent / Legitimate interests"],
            ["Transactional Alerts", "Performance of contract / Legitimate interests"],
            ["Marketing Communications", "Consent"],
            ["Analytics & Research", "Legitimate interests"],
            ["Legal Compliance", "Legal obligation"],
            ["Enforce Terms", "Legitimate interests / Legal obligation"],
          ],
        },
        optOut: "Marketing opt-out: You may unsubscribe from marketing emails at any time by clicking 'Unsubscribe' in any marketing email, or by updating your notification preferences in Account Settings.",
      },
      howWeShare: {
        title: "5. How We Share Your Personal Data",
        intro: "We do not sell your personal data to third parties. We share data only as described below.",
        visible: {
          title: "5.1 Visible to Other Users",
          intro: "Certain data is inherently visible to other Platform users as part of the classifieds service:",
          items: [
            "Your display name, profile photo (if set), general location (emirate), and listing content.",
            "Your review submissions (attributed to your display name).",
            "Business users: Business name, logo, website, and verified status badge.",
          ],
          caution: "⚠ Caution: Do not include sensitive personal information (e.g., full address, bank details, Emirates ID number) in listing descriptions, photos, or messages. We cannot protect data you share publicly.",
        },
        serviceProviders: {
          title: "5.2 Service Providers",
          intro: "We share data with trusted third-party service providers who process data on our behalf, under strict data processing agreements:",
          table: {
            headers: ["Provider", "Category", "Data Shared"],
            rows: [
              ["Stripe", "Payment Processing", "Billing details, transaction amounts, fraud signals"],
              ["Google Cloud / AWS", "Cloud Hosting", "All Platform data (encrypted)"],
              ["Google Analytics", "Analytics", "Anonymised usage data, truncated IP"],
              ["Ad Partners (Google/Meta/Bing)", "Advertising", "Hashed email, ad interactions, pixel data"],
              ["SendGrid / Twilio", "Communications", "Email, phone for transactional messages"],
              ["Firebase", "Notifications", "Device token, notification content"],
              ["Social Media (YouTube/Instagram/TikTok/etc)", "Social Interactions", "Pixel data, hashtags, engagement metrics"],
              ["Sentry / Datadog", "Error Monitoring", "Anonymised error logs, device info"],
            ],
          },
        },
        legal: {
          title: "5.3 Legal Disclosures",
          intro: "We may disclose your personal data to government authorities, regulators, or courts where required by UAE law, including:",
          items: [
            "To comply with a legal obligation, court order, or regulatory requirement.",
            "To protect the rights, property, or safety of BuyOrSell, our users, or the public.",
            "To investigate or prevent fraud, illegal activity, or violations of our Terms.",
          ],
        },
        business: {
          title: "5.4 Business Transfers",
          content: "If we are involved in a merger, acquisition, or sale of assets, your personal data may be transferred. We will notify you before your data becomes subject to a different privacy policy.",
        },
      },
      transfers: {
        title: "6. International Data Transfers",
        content: [
          "The Platform is operated from the UAE, and your data is primarily stored on UAE-based servers.",
          "Some of our service providers may process your data in centres located outside the UAE, including the EU and USA.",
        ],
        items: [
          "Standard Contractual Clauses (SCCs)",
          "Adequacy decisions",
          "Binding corporate rules where applicable",
        ],
        outro: "You may request information about the safeguards we use for international transfers by contacting us.",
      },
      retention: {
        title: "7. Data Retention",
        intro: "We retain your personal data only for as long as necessary to fulfil the purposes described in this Policy:",
        table: {
          headers: ["Data Category", "Retention Period"],
          rows: [
            ["Active Account Data", "Duration of account + 1 year"],
            ["Listing Content", "Duration of listing + 6 months"],
            ["Financial Records", "7 years (UAE tax law)"],
            ["Communication Logs", "3 years"],
            ["In-platform Messages", "2 years from last activity"],
            ["Identity/Licence Docs", "5 years (Regulatory requirement)"],
            ["Deleted Account Data", "90 days (Recovery window)"],
          ],
        },
        outro: "After the applicable retention period, we will securely delete or anonymise your personal data.",
      },
      security: {
        title: "8. How We Protect Your Data",
        intro: "We implement appropriate technical and organisational security measures to protect your personal data. Our measures include:",
        items: [
          "Encryption in transit: All data is protected using TLS 1.2+ (HTTPS).",
          "Encryption at rest: Sensitive data is encrypted using AES-256.",
          "Password security: Passwords are hashed using bcrypt.",
          "Access controls: Restricted to authorised personnel only.",
          "Two-factor authentication (2FA): Strongly recommended.",
          "Regular security testing: Vulnerability assessments and audits.",
          "Incident response: Data breach response plans in place.",
        ],
      },
      yourRights: {
        title: "9. Your Data Protection Rights",
        intro: "Under UAE Federal Decree-Law No. 45/2021 (PDPL) and applicable law, you have the following rights:",
        table: {
          headers: ["Right", "What It Means"],
          rows: [
            ["Right of Access", "Request a copy of the personal data we hold about you."],
            ["Right to Rectification", "Request correction of inaccurate or incomplete personal data."],
            ["Right to Erasure", "Request deletion of your personal data where it is no longer necessary."],
            ["Right to Restriction", "Request that we limit processing of your data in certain circumstances."],
            ["Right to Object", "Object to processing based on legitimate interests."],
            ["Right to Withdraw Consent", "Withdraw consent at any time for consent-based processing."],
          ],
        },
        outro: "Submit a request by emailing contact@buyorsell.ae with the subject line 'Data Subject Request'. We will respond within 7-15 business days.",
        accountSelfService: "Many rights can be exercised directly within the Platform via Account Settings → Privacy.",
      },
      cookies: {
        title: "10. Cookies and Tracking Technologies",
        intro: "We use cookies to operate and improve the Platform. On your first visit, a consent banner allows you to manage granular preferences.",
        outro: "You may update your cookie preferences at any time via Account Settings → Privacy → Cookie Preferences.",
      },
      children: {
        title: "11. Children's Privacy",
        intro: "The Platform is intended for users aged 18 and above. We do not knowingly collect personal data from children.",
        middle: "If we become aware that we have collected personal data from a child under 18 without appropriate consent, we will delete that data.",
        outro: "If you believe your child has provided personal data to us, please contact us at support@buyorsell.ae.",
        compliance: "We comply with the UAE Child Digital Safety Law and do not serve behavioural advertising to users under 18.",
      },
      thirdParty: {
        title: "12. Third-Party Websites and Services",
        intro: "The Platform may contain links to third-party services not operated by us.",
        middle: "This Privacy Policy does not apply to those services. We encourage you to read their privacy policies.",
        outro: "Where you use social login (Google/Apple), the relevant platform's policy also applies.",
      },
      changes: {
        title: "13. Changes to This Privacy Policy",
        intro: "We may update this Privacy Policy from time to time. We will notify you of material changes by:",
        items: [
          "Posting the updated Policy on the Platform with a revised 'Last Updated' date.",
          "Sending an email notification for significant changes affecting your rights.",
        ],
        outro: "Your continued use of the Platform after any changes constitutes your acceptance of the updated Policy.",
      },
      contact: {
        title: "14. Contact Us",
        intro: "If you have any questions regarding this Privacy Policy or your data, please contact us:",
        dpo: "Data Protection Officer - BuyOrSell.ae",
        company: "Souq Labs Technologies LLC SPC",
        address: "Abu Dhabi, United Arab Emirates",
        email: "contact@buyorsell.ae",
        support: "support@buyorsell.ae",
        phone: "+971 2 675 6766",
        responseTime: "We will respond to all privacy requests within 7-15 business days.",
      },
    },
  },
  ar: {
    title: "سياسة الخصوصية لـ BuyOrSell.ae",
    subtitle: "كيف نجمع بياناتك الشخصية ونستخدمها ونحميها",
    lastUpdated: "آخر تحديث: فبراير 2025",
    effective: "تاريخ السريان: فبراير 2025",
    navigation: "التنقل",
    assistance: {
      title: "هل تحتاج إلى مساعدة؟",
      description: "إذا كانت لديك أسئلة حول سياسة الخصوصية هذه، أو ممارسات البيانات لدينا، أو حقوقك، فيرجى الاتصال بنا.",
      emailSupport: "دعم البريد الإلكتروني",
    },
    sections: {
      glance: {
        title: "لمحة سريعة",
        items: {
          collect: "الاسم، تفاصيل الاتصال، بيانات القوائم، معلومات الدفع، بيانات الجهاز/الاستخدام.",
          why: "لتشغيل المنصة، ومعالجة المدفوعات، ومنع الاحتيال، وتحسين خدمتنا، وإرسال التسويق (بموافقة).",
          share: "معالجو المدفوعات (Stripe)، والتحليلات (Google)، وشركاء الإعلان (Meta, Bing)، ومزودو الاستضافة - جميعهم بموجب اتفاقيات بيانات صارمة.",
          rights: "الوصول، التصحيح، الحذف، التقييد، الاعتراض، ونقل بياناتك. سحب الموافقة في أي وقت.",
          contact: "contact@buyorsell.ae",
        },
      },
      whoWeAre: {
        title: "1. من نحن",
        content: [
          "تقوم شركة Souq Labs Technologies LLC SPC (\"BuyOrSell\" أو \"نحن\" أو \"إننا\" أو \"نا\") بتشغيل منصة الإعلانات المبوبة عبر الإنترنت على www.buyorsell.ae، وهي مسجلة في أبوظبي، الإمارات العربية المتحدة. نحن المتحكم في البيانات الشخصية التي تتم معالجتها من خلال المنصة.",
          "توضح سياسة الخصوصية هذه كيف نجمع بياناتك الشخصية ونستخدمها ونشاركها ونحتفظ بها ونحميها عند وصولك إلى المنصة أو استخدامها، وتصف حقوقك بموجب المرسوم بقانون اتحادي رقم 45 لسنة 2021 بشأن حماية البيانات الشخصية (\"PDPL\") وقوانين الخصوصية المعمول بها الأخرى.",
          "إذا كانت لديك أي أسئلة أو مخاوف، فيرجى الاتصال بنا: contact@buyorsell.ae.",
        ],
      },
      scope: {
        title: "2. نطاق هذه السياسة",
        intro: "تنطبق هذه السياسة على:",
        items: [
          "جميع مستخدمي المنصة، بما في ذلك الزوار، وأصحاب الحسابات المسجلة، والمشترين، والبائعين، والمؤجرين، والمستأجرين، وأصحاب العمل، والباحثين عن عمل، ومستخدمي الأعمال.",
          "البيانات الشخصية التي يتم جمعها من خلال الموقع الإلكتروني على www.buyorsell.ae، وتطبيقاتنا للهاتف المحمول، وأي خدمات ذات صلة.",
          "البيانات التي يتم جمعها عبر التواصل معنا (البريد الإلكتروني، الهاتف، الرسائل داخل التطبيق، تذاكر الدعم).",
        ],
        outro: "لا تنطبق هذه السياسة على مواقع الويب أو التطبيقات أو الخدمات التابعة لجهات خارجية والمنطلقة من المنصة. نحن نشجعك على قراءة سياسات الخصوصية لأي خدمات تابعة لجهات خارجية تستخدمها.",
      },
      dataWeCollect: {
        title: "3. البيانات الشخصية التي نجمعها",
        intro: "نجمع البيانات الشخصية بثلاث طرق رئيسية: البيانات التي تقدمها لنا مباشرة، والبيانات التي يتم جمعها تلقائياً، والبيانات الواردة من أطراف ثالثة.",
        direct: {
          title: "3.1 البيانات التي تقدمها مباشرة",
          table: {
            headers: ["الفئة", "أمثلة"],
            rows: [
              ["معلومات الحساب", "الاسم الكامل، عنوان البريد الإلكتروني، رقم الهاتف المحمول، كلمة المرور (مشفرة)، صورة الملف الشخصي"],
              ["الهوية والتحقق", "رقم الهوية الإماراتية، رقم الرخصة التجارية، رخصة ريرا/العقارات (لمستخدمي الأعمال)"],
              ["محتوى القائمة", "أوصاف العناصر، الصور، مقاطع الفيديو، التسعير، الفئة، الموقع (الإمارة/المنطقة)"],
              ["معلومات الدفع", "تفاصيل بطاقة الائتمان/الخصم (عن طريق Stripe)، عنوان الفاتورة، سجل المعاملات"],
              ["الاتصالات", "الرسائل المرسلة عبر المراسلة داخل المنصة والبريد الإلكتروني وتذاكر الدعم"],
              ["المراجعات والتقييمات", "درجات التقييم، المراجعات المكتوبة للمستخدمين الآخرين"],
              ["طلبات الوظائف والسير الذاتية", "سجل العمل، التعليم، المهارات، المراجع (إذا تم تحميلها)"],
              ["ملف تعريف الأعمال", "اسم العمل، الشعار، عنوان URL للموقع الإلكتروني، وصف العمل"],
              ["التفضيلات والإعدادات", "تفضيل اللغة (العربية/الإنجليزية)، إعدادات الإشعارات، عمليات البحث المحفوظة"],
            ],
          },
        },
        automatic: {
          title: "3.2 البيانات التي يتم جمعها تلقائياً",
          intro: "عند استخدامك للمنصة، نجمع تلقائياً البيانات التقنية وبيانات الاستخدام، بما في ذلك:",
          items: [
            "بيانات الجهاز: عنوان IP، نوع الجهاز، نظام التشغيل، نوع المتصفح وإصداره، دقة الشاشة.",
            "بيانات الاستخدام: الصفحات التي تمت زيارتها، القوائم المعروضة، استعلامات البحث، الفلاتر المطبقة، الوقت الذي يقضيه في الصفحات، أنماط النقر، وعناوين URL للإحالة.",
            "بيانات الموقع: الموقع العام المستنتج من عنوان IP (على مستوى الإمارة). نحن لا نجمع موقع GPS دقيق إلا إذا منحت إذناً صريحاً للميزات القائمة على الموقع.",
            "بيانات ملفات تعريف الارتباط والتتبع: معرفات الجلسة، معرفات التحليلات، معرفات الإعلان. راجع القسم 10 (سياسة ملفات تعريف الارتباط) للحصول على التفاصيل الكاملة.",
            "سجلات المعاملات: مشتريات الاشتراك، تواريخ التجديد، حالة الدفع، وطلبات الاسترداد.",
          ],
        },
        thirdParty: {
          title: "3.3 البيانات الواردة من أطراف ثالثة",
          items: [
            "مزودو تسجيل الدخول الاجتماعي: إذا قمت بالتسجيل أو تسجيل الدخول باستخدام Google أو Apple، فإننا نتلقى اسمك وعنوان بريدك الإلكتروني وصورة ملفك الشخصي من تلك الخدمات.",
            "معالجو الدفع: قد تشارك Stripe تأكيد المعاملة، ودرجات مخاطر الاحتيال، وحالة التحقق من البطاقة.",
            "شركاء الإعلان: قد يشارك Google Ads و Meta بيانات قطاع الجمهور لاستهداف الإعلانات وقياسها.",
            "خدمات التحقق: عندما نستخدم خدمات التحقق من الهوية أو الترخيص التابعة لجهات خارجية، فإننا نتلقى نتائج التأكيد.",
          ],
        },
      },
      howWeUse: {
        title: "4. كيف نستخدم بياناتك الشخصية",
        intro: "نحن نعالج بياناتك الشخصية فقط عندما يكون لدينا أساس قانوني للقيام بذلك بموجب قانون حماية البيانات الشخصية وقانون دولة الإمارات العربية المتحدة المعمول به. يوضح الجدول أدناه أنشطة المعالجة والأساس القانوني لكل منها.",
        table: {
          headers: ["الغرض", "الأساس القانوني"],
          rows: [
            ["إدارة الحساب", "تنفيذ العقد"],
            ["عرض القوائم", "تنفيذ العقد"],
            ["المدفوعات والاشتراكات", "تنفيذ العقد"],
            ["دعم العملاء", "تنفيذ العقد / المصالح المشروعة"],
            ["منع الاحتيال", "المصالح المشروعة / الالتزام القانوني"],
            ["التحقق من الهوية", "الالتزام القانوني / المصالح المشروعة"],
            ["تحسين المنصة", "المصالح المشروعة"],
            ["التخصيص", "الموافقة / المصالح المشروعة"],
            ["تنبيهات المعاملات", "تنفيذ العقد / المصالح المشروعة"],
            ["اتصالات التسويق", "الموافقة"],
            ["التحليلات والبحث", "المصالح المشروعة"],
            ["الامتثال القانوني", "الالتزام القانوني"],
            ["فرض الشروط", "المصالح المشروعة / الالتزام القانوني"],
          ],
        },
        optOut: "إلغاء الاشتراك في التسويق: يمكنك إلغاء الاشتراك في رسائل البريد الإلكتروني التسويقية في أي وقت بالنقر فوق 'إلغاء الاشتراك' في أي بريد إلكتروني تسويقي، أو عن طريق تحديث تفضيلات الإشعارات في إعدادات الحساب.",
      },
      howWeShare: {
        title: "5. كيف نشارك بياناتك الشخصية",
        intro: "نحن لا نبيع بياناتك الشخصية لأطراف ثالثة. نحن نشارك البيانات فقط كما هو موضح أدناه.",
        visible: {
          title: "5.1 مرئي للمستخدمين الآخرين",
          intro: "تكون بعض البيانات مرئية بطبيعتها لمستخدمي المنصة الآخرين كجزء من خدمة الإعلانات المبوبة:",
          items: [
            "اسم العرض الخاص بك، وصورة الملف الشخصي (إذا تم تعيينها)، والموقع العام (الإمارة)، ومحتوى القائمة.",
            "تقديمات المراجعة الخاصة بك (تنسب إلى اسم العرض الخاص بك).",
            "مستخدمو الأعمال: اسم العمل والشعار والموقع الإلكتروني وشارة حالة التحقق.",
          ],
          caution: "⚠ تنبيه: لا تدرج معلومات شخصية حساسة (مثل العنوان الكامل، وتفاصيل البنك، ورقم الهوية الإماراتية) في أوصاف القائمة أو الصور أو الرسائل. لا يمكننا حماية البيانات التي تشاركها علناً.",
        },
        serviceProviders: {
          title: "5.2 مزودو الخدمة",
          intro: "نشارك البيانات مع مزودي خدمة خارجيين موثوقين يعالجون البيانات نيابة عنا، بموجب اتفاقيات معالجة بيانات صارمة:",
          table: {
            headers: ["المزود", "الفئة", "البيانات المشتركة"],
            rows: [
              ["Stripe", "معالجة الدفع", "تفاصيل الفواتير، مبالغ المعاملات، إشارات الاحتيال"],
              ["Google Cloud / AWS", "استضافة سحابية", "جميع بيانات المنصة (مشفرة)"],
              ["Google Analytics", "تحليلات", "بيانات استخدام مجهولة الهوية، عنوان IP مقتطع"],
              ["شركاء الإعلان (Google/Meta/Bing)", "إعلان", "البريد الإلكتروني المشفر، تفاعلات الإعلانات، بيانات البكسل"],
              ["SendGrid / Twilio", "اتصالات", "البريد الإلكتروني، الهاتف للرسائل المتعلقة بالمعاملات"],
              ["Firebase", "إشعارات", "رمز الجهاز، محتوى الإشعار"],
              ["وسائل التواصل الاجتماعي (YouTube/Instagram/TikTok/إلخ)", "التفاعلات الاجتماعية", "بيانات البكسل، الهاشتاج، مقاييس المشاركة"],
              ["Sentry / Datadog", "مراقبة الأخطاء", "سجلات أخطاء مجهولة الهوية، معلومات الجهاز"],
            ],
          },
        },
        legal: {
          title: "5.3 الإفصاحات القانونية",
          intro: "قد نفصح عن بياناتك الشخصية للسلطات الحكومية أو الهيئات التنظيمية أو المحاكم عندما يقتضي قانون دولة الإمارات العربية المتحدة ذلك، بما في ذلك:",
          items: [
            "للامتثال لالتزام قانوني أو أمر محكمة أو متطلب تنظيمي.",
            "لحماية حقوق أو ممتلكات أو سلامة BuyOrSell أو مستخدمينا أو الجمهور.",
            "للتحقيق في الاحتيال أو الأنشطة غير القانونية أو انتهاكات شروطنا أو منعها.",
          ],
        },
        business: {
          title: "5.4 عمليات نقل الأعمال",
          content: "إذا شاركنا في عملية دمج أو استحواذ أو بيع أصول، فقد يتم نقل بياناتك الشخصية. سنقوم بإخطارك قبل أن تصبح بياناتك خاضعة لسياسة خصوصية مختلفة.",
        },
      },
      transfers: {
        title: "6. عمليات نقل البيانات الدولية",
        content: [
          "يتم تشغيل المنصة من دولة الإمارات العربية المتحدة، ويتم تخزين بياناتك بشكل أساسي على خوادم مقرها الإمارات العربية المتحدة.",
          "قد يقوم بعض مزودي الخدمة لدينا بمعالجة بياناتك في مراكز تقع خارج دولة الإمارات العربية المتحدة، بما في ذلك الاتحاد الأوروبي والولايات المتحدة الأمريكية.",
        ],
        items: [
          "الشروط التعاقدية القياسية (SCCs)",
          "قرارات الكفاية",
          "قواعد الشركات الملزمة عند الاقتضاء",
        ],
        outro: "يمكنك طلب معلومات حول الضمانات التي نستخدمها لعمليات النقل الدولية عن طريق الاتصال بنا.",
      },
      retention: {
        title: "7. الاحتفاظ بالبيانات",
        intro: "نحتفظ ببياناتك الشخصية فقط طالما كان ذلك ضرورياً لتحقيق الأغراض الموضحة في هذه السياسة:",
        table: {
          headers: ["فئة البيانات", "فترة الاحتفاظ"],
          rows: [
            ["بيانات الحساب النشط", "مدة الحساب + سنة واحدة"],
            ["محتوى القائمة", "مدة القائمة + 6 أشهر"],
            ["السجلات المالية", "7 سنوات (قانون الضرائب الإماراتي)"],
            ["سجلات الاتصالات", "3 سنوات"],
            ["الرسائل داخل المنصة", "سنتان من آخر نشاط"],
            ["وثائق الهوية/الترخيص", "5 سنوات (متطلب تنظيمي)"],
            ["بيانات الحساب المحذوف", "90 يوماً (نافذة الاسترداد)"],
          ],
        },
        outro: "بعد فترة الاحتفاظ المعمول بها، سنقوم بحذف بياناتك الشخصية أو إخفاء هويتها بشكل آمن.",
      },
      security: {
        title: "8. كيف نحمي بياناتك",
        intro: "نحن نطبق إجراءات أمنية فنية وتنظيمية مناسبة لحماية بياناتك الشخصية. تشمل إجراءاتنا ما يلي:",
        items: [
          "التشفير أثناء النقل: جميع البيانات محمية باستخدام TLS 1.2+ (HTTPS).",
          "التشفير عند السكون: يتم تشفير البيانات الحساسة باستخدام AES-256.",
          "أمان كلمة المرور: يتم تشفير كلمات المرور باستخدام bcrypt.",
          "ضوابط الوصول: تقتصر على الموظفين المصرح لهم فقط.",
          "المصادقة الثنائية (2FA): نوصي بها بشدة.",
          "اختبار الأمان المنتظم: تقييمات الضعف وعمليات التدقيق.",
          "الاستجابة للحوادث: خطط الاستجابة لخرق البيانات المعمول بها.",
        ],
      },
      yourRights: {
        title: "9. حقوق حماية البيانات الخاصة بك",
        intro: "بموجب المرسوم بقانون اتحادي رقم 45 لسنة 2021 (PDPL) والقانون المعمول به، لديك الحقوق التالية:",
        table: {
          headers: ["الحق", "ماذا يعني"],
          rows: [
            ["الحق في الوصول", "طلب نسخة من البيانات الشخصية التي نحتفظ بها عنك."],
            ["الحق في التصحيح", "طلب تصحيح البيانات الشخصية غير الدقيقة أو غير الكاملة."],
            ["الحق في المحو", "طلب حذف بياناتك الشخصية عندما لا تعد ضرورية."],
            ["الحق في التقييد", "طلب تقييد معالجة بياناتك في ظروف معينة."],
            ["الحق في الاعتراض", "الاعتراض على المعالجة بناءً على المصالح المشروعة."],
            ["الحق في سحب الموافقة", "سحب الموافقة في أي وقت للمعالجة القائمة على الموافقة."],
          ],
        },
        outro: "قم بتقديم طلب عن طريق إرسال بريد إلكتروني إلى contact@buyorsell.ae مع موضوع 'طلب صاحب البيانات'. سنرد خلال 7-15 يوم عمل.",
        accountSelfService: "يمكن ممارسة العديد من الحقوق مباشرة داخل المنصة عبر إعدادات الحساب ← الخصوصية.",
      },
      cookies: {
        title: "10. ملفات تعريف الارتباط وتقنيات التتبع",
        intro: "نستخدم ملفات تعريف الارتباط لتشغيل وتحسين المنصة. عند زيارتك الأولى، تسمح لك لافتة الموافقة بإدارة التفضيلات التفصيلية.",
        outro: "يمكنك تحديث تفضيلات ملفات تعريف الارتباط الخاصة بك في أي وقت عبر إعدادات الحساب ← الخصوصية ← تفضيلات ملفات تعريف الارتباط.",
      },
      children: {
        title: "11. خصوصية الأطفال",
        intro: "المنصة مخصصة للمستخدمين الذين تبلغ أعمارهم 18 عاماً فما فوق. نحن لا نجمع بيانات شخصية عن عمد من الأطفال.",
        middle: "إذا علمنا أننا جمعنا بيانات شخصية من طفل دون سن 18 عاماً دون موافقة مناسبة، فسنقوم بحذف تلك البيانات.",
        outro: "إذا كنت تعتقد أن طفلك قد قدم بيانات شخصية لنا، فيرجى الاتصال بنا على support@buyorsell.ae.",
        compliance: "نحن نمتثل لقانون السلامة الرقمية للطفل في الإمارات العربية المتحدة ولا نقدم إعلانات سلوكية للمستخدمين دون سن 18 عاماً.",
      },
      thirdParty: {
        title: "12. مواقع وخدمات الطرف الثالث",
        intro: "قد تحتوي المنصة على روابط لخدمات تابعة لجهات خارجية لا نديرها نحن.",
        middle: "سياسة الخصوصية هذه لا تنطبق على تلك الخدمات. نحن نشجعك على قراءة سياسات الخصوصية الخاصة بها.",
        outro: "عندما تستخدم تسجيل الدخول الاجتماعي (Google/Apple)، تنطبق أيضاً سياسة المنصة ذات الصلة.",
      },
      changes: {
        title: "13. التغييرات في سياسة الخصوصية هذه",
        intro: "قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر. سنقوم بإخطارك بالتغييرات الجوهرية عن طريق:",
        items: [
          "نشر السياسة المحدثة على المنصة مع تاريخ 'آخر تحديث' معدل.",
          "إرسال إشعار عبر البريد الإلكتروني للتغييرات الهامة التي تؤثر على حقوقك.",
        ],
        outro: "استمرارك في استخدام المنصة بعد أي تغييرات يشكل قبولك للسياسة المحدثة.",
      },
      contact: {
        title: "14. اتصل بنا",
        intro: "إذا كانت لديك أي أسئلة بخصوص سياسة الخصوصية هذه أو بياناتك، فيرجى الاتصال بنا:",
        dpo: "مسؤول حماية البيانات - BuyOrSell.ae",
        company: "Souq Labs Technologies LLC SPC",
        address: "أبوظبي، الإمارات العربية المتحدة",
        email: "contact@buyorsell.ae",
        support: "support@buyorsell.ae",
        phone: "+971 2 675 6766",
        responseTime: "سنرد على جميع طلبات الخصوصية في غضون 7-15 يوم عمل.",
      },
    },
  },
  nl: {
    title: "BuyOrSell.ae Privacybeleid",
    subtitle: "Hoe wij uw persoonlijke gegevens verzamelen, gebruiken en beschermen",
    lastUpdated: "Laatst bijgewerkt: februari 2025",
    effective: "Ingangsdatum: februari 2025",
    navigation: "Navigatie",
    assistance: {
      title: "Hulp nodig?",
      description: "Als u vragen heeft over dit privacybeleid, onze gegevenspraktijken of uw rechten, neem dan contact met ons op.",
      emailSupport: "E-mail ondersteuning",
    },
    sections: {
      glance: {
        title: "In een oogopslag",
        items: {
          collect: "We verzamelen informatie die u verstrekt, technische gegevens en details van derden.",
          why: "We gebruiken uw gegevens om diensten te verlenen, ons platform te verbeteren en BuyOrSell veilig te houden.",
          share: "We delen gegevens met serviceproviders en om wettelijke redenen, maar we verkopen uw persoonlijke info niet.",
          rights: "U kunt op elk moment uw gegevens bekijken, bijwerken en uw instellingen beheren.",
          contact: "Ons supportteam is er om te helpen bij zorgen over privacy.",
        },
      },
      whoWeAre: {
        title: "1. Wie wij zijn",
        content: [
          "Souq Labs Technologies LLC SPC (\"BuyOrSell\", \"wij\", \"ons\", \"onze\") exploiteert het online advertentieplatform op www.buyorsell.ae, geregistreerd in Abu Dhabi, Verenigde Arabische Emiraten. Wij zijn de verwerkingsverantwoordelijke voor de persoonlijke gegevens die via het platform worden verwerkt.",
          "Dit privacybeleid legt uit hoe wij uw persoonlijke gegevens verzamelen, gebruiken, delen, bewaren en beschermen wanneer u het platform bezoekt of gebruikt, en beschrijft uw rechten onder de UAE Federal Decree-Law No. 45/2021 on Personal Data Protection (\"PDPL\") and andere toepasselijke privacywetgeving.",
          "Als u vragen of zorgen heeft, neem dan contact met ons op: contact@buyorsell.ae.",
        ],
      },
      scope: {
        title: "Reikwijdte van dit beleid",
        intro: "Dit privacybeleid legt uit hoe wij persoonlijke gegevens verzamelen en gebruiken wanneer u:",
        items: [
          "Onze website bezoekt of gebruikt (BuyOrSell.ae)",
          "Onze mobiele applicatie gebruikt",
          "Met ons communiceert via e-mail, chat of telefoon",
          "Interactie heeft met onze advertenties op platforms van derden",
        ],
        outro: "Door onze Service te gebruiken, gaat u akkoord met het verzamelen en gebruiken van informatie in overeenstemming met dit beleid.",
      },
      dataWeCollect: {
        title: "Gegevens die we verzamelen",
        intro: "Persoonlijke gegevens zijn alle gegevens waarmee u geïdentificeerd kunt worden.",
        direct: {
          title: "Informatie die u rechtstreeks verstrekt",
          table: {
            headers: ["Categorie", "Voorbeelden"],
            rows: [
              ["Accountinformatie", "Naam, e-mail, telefoonnummer, wachtwoord"],
              ["Profieldetails", "Profielfoto, locatie, bio"],
              ["Advertentie-inhoud", "Titels, beschrijvingen, foto's, video's die u plaatst"],
              ["Verificatie", "Emirates ID details (als u uw account verifieert)"],
              ["Communicatie", "Berichten verzonden via ons chatsysteem"],
            ],
          },
        },
        automatic: {
          title: "Informatie die automatisch wordt verzameld",
          intro: "Wanneer u BuyOrSell gebruikt, verzamelen we automatisch bepaalde technische informatie:",
          items: [
            "Loggegevens: IP-adres, browsertype, bekeken pagina's",
            "Apparaatgegevens: Apparaatmodel, besturingssysteem, unieke ID's",
            "Locatiegegevens: Geschatte locatie op basis van IP of GPS (met toestemming)",
            "Gebruiksgegevens: Gebruikte functies, zoektermen, interactie met advertenties",
          ],
        },
        thirdParty: {
          title: "Informatie van derden",
          items: [
            "Social Media: Als u inlogt via Google, Facebook of Apple",
            "Partners: Fraudepreventiediensten en marketingpartners",
          ],
        },
      },
      howWeUse: {
        title: "Hoe wij uw gegevens gebruiken",
        intro: "Wij verwerken uw gegevens voor de volgende doeleinden:",
        table: {
          headers: ["Doel", "Wettelijke basis"],
          rows: [
            ["Service leveren", "Contractuele noodzaak"],
            ["Veiligheid & Beveiliging", "Gerechtvaardigd belang"],
            ["Personalisatie", "Gerechtvaardigd belang"],
            ["Marketing", "Toestemming (indien vereist)"],
            ["Compliance", "Wettelijke verplichting"],
          ],
        },
        optOut: "U kunt zich op elk moment afmelden voor marketingcommunicatie via uw instellingen.",
      },
      howWeShare: {
        title: "Hoe wij uw gegevens delen",
        intro: "Wij verkopen uw persoonlijke gegevens niet. Wij delen deze alleen zoals hieronder beschreven:",
        visible: {
          title: "Zichtbaar voor andere gebruikers",
          intro: "Bepaalde informatie is zichtbaar voor anderen die de Service gebruiken:",
          items: [
            "Uw openbare profiel (naam, datum van lidmaatschap, waardering)",
            "Inhoud van uw advertenties (titel, beschrijving, foto's)",
            "Uw geschatte locatie (indien gedeeld in een advertentie)",
          ],
          caution: "Deel geen privénummers of adressen in advertentiebeschrijvingen.",
        },
        serviceProviders: {
          title: "Serviceproviders",
          intro: "We gebruiken externe bedrijven om ons te helpen onze Service te exploiteren:",
          table: {
            headers: ["Type", "Voorbeeldactiviteit"],
            rows: [
              ["Hosting", "Gegevens opslaan en het platform draaien"],
              ["Analyse", "Begrijpen hoe gebruikers omgaan met de app"],
              ["Betaling", "Transacties veilig verwerken"],
              ["Berichten", "Meldingen en SMS verzenden"],
            ],
          },
        },
        legal: {
          title: "Wettelijk en veiligheid",
          intro: "Wij kunnen gegevens vrijgeven als dit wettelijk vereist is of om:",
          items: [
            "Te voldoen aan een juridisch proces (bijv. gerechtelijk bevel)",
            "Fraude of misbruik van onze Service te voorkomen",
            "De veiligheid van onze gebruikers en het publiek te beschermen",
          ],
        },
        business: {
          title: "Bedrijfsoverdrachten",
          content: "In het geval van een fusie, overname of verkoop van activa kunnen uw gegevens worden overgedragen aan de nieuwe eigenaar.",
        },
      },
      transfers: {
        title: "Internationale gegevensoverdrachten",
        content: [
          "BuyOrSell is gevestigd in de Verenigde Arabische Emiraten, maar we kunnen servers gebruiken die zich in Europa, de VS of elders bevinden.",
          "Uw informatie kan worden overgedragen naar en onderhouden op computers die zich buiten uw staat of land bevinden.",
        ],
        items: [
          "Standard Contractual Clauses (SCC's)",
          "Adequaatheidbesluiten waar van toepassing",
        ],
        outro: "Wij nemen alle redelijkerwijs noodzakelijke stappen om ervoor te zorgen dat uw gegevens veilig worden behandeld.",
      },
      retention: {
        title: "Gegevensbewaring",
        intro: "We bewaren uw gegevens zolang dit nodig is om de Service te leveren:",
        table: {
          headers: ["Gegevenstype", "Bewaartermijn"],
          rows: [
            ["Accountinformatie", "Totdat het account wordt verwijderd"],
            ["Advertenties", "Totdat ze worden verwijderd of 1 jaar na verloop"],
            ["Berichten", "Tot 5 jaar (voor veiligheid/wettelijk)"],
            ["Logs", "90 dagen tot 1 jaar"],
          ],
        },
        outro: "Na afloop van de periode verwijderen of anonimiseren we de gegevens.",
      },
      security: {
        title: "Beveiliging",
        intro: "We gebruiken standaard beveiligingsmaatregelen om uw gegevens te beschermen:",
        items: [
          "Secure Socket Layer (SSL) encryptie voor alle gegevensoverdrachten",
          "Regelmatige beveiligingsaudits en kwetsbaarheidsscans",
          "Strenge toegangscontroles om onbevoegde toegang tot gegevens te voorkomen",
        ],
      },
      yourRights: {
        title: "9. Uw rechten op gegevensbescherming",
        intro: "Onder de federale wet van de VAE nr. 45/2021 (PDPL) en de toepasselijke wetgeving heeft u de volgende rechten met betrekking tot uw persoonlijke gegevens:",
        table: {
          headers: ["Recht", "Wat het betekent"],
          rows: [
            ["Recht op inzage", "Vraag een kopie aan van de persoonlijke gegevens die wij over u bewaren."],
            ["Recht op rectificatie", "Vraag om correctie van onjuiste of onvolledige persoonlijke gegevens."],
            ["Recht op gegevenswissing", "Vraag om verwijdering van uw persoonlijke gegevens wanneer deze niet langer nodig zijn."],
            ["Recht op beperking", "Verzoek dat wij de verwerking van uw gegevens in bepaalde omstandigheden beperken."],
            ["Recht van bezwaar", "Maak bezwaar tegen verwerking op basis van gerechtvaardigde belangen."],
            ["Recht om toestemming in te trekken", "Trek uw toestemming op elk gewenst moment in voor verwerkingen op basis van toestemming."],
          ],
        },
        outro: "Vraag een aanvraag in door een e-mail te sturen naar contact@buyorsell.ae met de onderwerpregel 'Data Subject Request'. Wij reageren binnen 7-15 werkdagen.",
        accountSelfService: "Veel rechten kunnen rechtstreeks binnen het platform worden uitgeoefend via Accountinstellingen → Privacy.",
      },
      cookies: {
        title: "10. Cookies en trackingtechnologieën",
        intro: "Wij gebruiken cookies en soortgelijke trackingtechnologieën om het platform te exploiteren en te verbeteren. Raadpleeg voor volledige details ons Cookiebeleid in Sectie 14 van onze Algemene Voorwaarden.",
        outro: "U kunt uw cookievoorkeuren op elk moment bijwerken via Accountinstellingen → Privacy → Cookievoorkeuren.",
      },
      children: {
        title: "11. Privacy van kinderen",
        intro: "Het platform is bedoeld voor gebruikers van 18 jaar en ouder. Wij verzamelen niet bewust persoonlijke gegevens van kinderen onder de 18 jaar.",
        middle: "Als we merken dat we persoonlijke gegevens hebben verzameld van een kind jonger dan 18 jaar zonder passende toestemming van de ouders, zullen we onmiddellijk stappen ondernemen om die gegevens te verwijderen.",
        outro: "Als u denkt dat uw kind persoonlijke gegevens aan ons heeft verstrekt, neem dan contact met ons op via support@buyorsell.ae.",
        compliance: "Wij voldoen aan de UAE Child Digital Safety Law en tonen geen gedragsadvertenties aan gebruikers onder de 18 jaar.",
      },
      thirdParty: {
        title: "12. Websites en diensten van derden",
        intro: "Het platform kan links bevatten naar websites van derden, social media platforms of diensten die niet door ons worden beheerd.",
        middle: "Dit privacybeleid is niet van toepassing op die diensten van derden. Wij zijn niet verantwoordelijk voor hun privacypraktijken of inhoud.",
        outro: "Wanneer u social login gebruikt (Google of Apple), is ook het privacybeleid van het betreffende platform van toepassing.",
      },
      changes: {
        title: "13. Wijzigingen in dit privacybeleid",
        intro: "We kunnen dit privacybeleid van tijd tot tijd bijwerken. We zullen u op de hoogte stellen van materiële wijzigingen door:",
        items: [
          "Het bijgewerkte beleid op het platform te plaatsen met een herziene 'Laatst bijgewerkt'-datum.",
          "Een e-mailmelding te sturen naar uw geregistreerde e-mailadres voor belangrijke wijzigingen.",
        ],
        outro: "Uw voortgezet gebruik van het platform na eventuele wijzigingen houdt in dat u akkoord gaat met het bijgewerkte beleid.",
      },
      contact: {
        title: "14. Neem contact met ons op",
        intro: "Als u vragen heeft over dit privacybeleid of uw gegevens, neem dan contact met ons op:",
        dpo: "Functionaris voor gegevensbescherming - BuyOrSell.ae",
        company: "Souq Labs Technologies LLC SPC",
        address: "Abu Dhabi, Verenigde Arabische Emiraten",
        email: "contact@buyorsell.ae",
        support: "support@buyorsell.ae",
        phone: "+971 2 675 6766",
        responseTime: "Wij reageren op alle privacyverzoeken binnen 7-15 werkdagen.",
      },
    },
  },
  "nl-NL": {
    title: "BuyOrSell.ae Privacybeleid",
    subtitle: "Hoe wij uw persoonlijke gegevens verzamelen, gebruiken en beschermen",
    lastUpdated: "Laatst bijgewerkt: februari 2025",
    effective: "Ingangsdatum: februari 2025",
    navigation: "Navigatie",
    assistance: {
      title: "Hulp nodig?",
      description: "Als u vragen heeft over dit privacybeleid, onze gegevenspraktijken of uw rechten, neem dan contact met ons op.",
      emailSupport: "E-mail ondersteuning",
    },
    sections: {
      glance: {
        title: "In een oogopslag",
        items: {
          collect: "We verzamelen informatie die u verstrekt, technische gegevens en details van derden.",
          why: "We gebruiken uw gegevens om diensten te verlenen, ons platform te verbeteren en BuyOrSell veilig te houden.",
          share: "We delen gegevens met serviceproviders en om wettelijke redenen, maar we verkopen uw persoonlijke info niet.",
          rights: "U kunt op elk moment uw gegevens bekijken, bijwerken en uw instellingen beheren.",
          contact: "Ons supportteam is er om te helpen bij zorgen over privacy.",
        },
      },
      whoWeAre: {
        title: "1. Wie wij zijn",
        content: [
          "Souq Labs Technologies LLC SPC (\"BuyOrSell\", \"wij\", \"ons\", \"onze\") exploiteert het online advertentieplatform op www.buyorsell.ae, geregistreerd in Abu Dhabi, Verenigde Arabische Emiraten. Wij zijn de verwerkingsverantwoordelijke voor de persoonlijke gegevens die via het platform worden verwerkt.",
          "Dit privacybeleid legt uit hoe wij uw persoonlijke gegevens verzamelen, gebruiken, delen, bewaren en beschermen wanneer u het platform bezoekt of gebruikt, en beschrijft uw rechten onder de UAE Federal Decree-Law No. 45/2021 on Personal Data Protection (\"PDPL\") and andere toepasselijke privacywetgeving.",
          "Als u vragen of zorgen heeft, neem dan contact met ons op: contact@buyorsell.ae.",
        ],
      },
      scope: {
        title: "Reikwijdte van dit beleid",
        intro: "Dit privacybeleid legt uit hoe wij persoonlijke gegevens verzamelen en gebruiken wanneer u:",
        items: [
          "Onze website bezoekt of gebruikt (BuyOrSell.ae)",
          "Onze mobiele applicatie gebruikt",
          "Met ons communiceert via e-mail, chat of telefoon",
          "Interactie heeft met onze advertenties op platforms van derden",
        ],
        outro: "Door onze Service te gebruiken, gaat u akkoord met het verzamelen en gebruiken van informatie in overeenstemming met dit beleid.",
      },
      dataWeCollect: {
        title: "Gegevens die we verzamelen",
        intro: "Persoonlijke gegevens zijn alle gegevens waarmee u geïdentificeerd kunt worden.",
        direct: {
          title: "Informatie die u rechtstreeks verstrekt",
          table: {
            headers: ["Categorie", "Voorbeelden"],
            rows: [
              ["Accountinformatie", "Naam, e-mail, telefoonnummer, wachtwoord"],
              ["Profieldetails", "Profielfoto, locatie, bio"],
              ["Advertentie-inhoud", "Titels, beschrijvingen, foto's, video's die u plaatst"],
              ["Verificatie", "Emirates ID details (als u uw account verifieert)"],
              ["Communicatie", "Berichten verzonden via ons chatsysteem"],
            ],
          },
        },
        automatic: {
          title: "Informatie die automatisch wordt verzameld",
          intro: "Wanneer u BuyOrSell gebruikt, verzamelen we automatisch bepaalde technische informatie:",
          items: [
            "Loggegevens: IP-adres, browsertype, bekeken pagina's",
            "Apparaatgegevens: Apparaatmodel, besturingssysteem, unieke ID's",
            "Locatiegegevens: Geschatte locatie op basis van IP of GPS (met toestemming)",
            "Gebruiksgegevens: Gebruikte functies, zoektermen, interactie met advertenties",
          ],
        },
        thirdParty: {
          title: "Informatie van derden",
          items: [
            "Social Media: Als u inlogt via Google, Facebook of Apple",
            "Partners: Fraudepreventiediensten en marketingpartners",
          ],
        },
      },
      howWeUse: {
        title: "Hoe wij uw gegevens gebruiken",
        intro: "Wij verwerken uw gegevens voor de volgende doeleinden:",
        table: {
          headers: ["Doel", "Wettelijke basis"],
          rows: [
            ["Service leveren", "Contractuele noodzaak"],
            ["Veiligheid & Beveiliging", "Gerechtvaardigd belang"],
            ["Personalisatie", "Gerechtvaardigd belang"],
            ["Marketing", "Toestemming (indien vereist)"],
            ["Compliance", "Wettelijke verplichting"],
          ],
        },
        optOut: "U kunt zich op elk moment afmelden voor marketingcommunicatie via uw instellingen.",
      },
      howWeShare: {
        title: "Hoe wij uw gegevens delen",
        intro: "Wij verkopen uw persoonlijke gegevens niet. Wij delen deze alleen zoals hieronder beschreven:",
        visible: {
          title: "Zichtbaar voor andere gebruikers",
          intro: "Bepaalde informatie is zichtbaar voor anderen die de Service gebruiken:",
          items: [
            "Uw openbare profiel (naam, datum van lidmaatschap, waardering)",
            "Inhoud van uw advertenties (titel, beschrijving, foto's)",
            "Uw geschatte locatie (indien gedeeld in een advertentie)",
          ],
          caution: "Deel geen privénummers of adressen in advertentiebeschrijvingen.",
        },
        serviceProviders: {
          title: "Serviceproviders",
          intro: "We gebruiken externe bedrijven om ons te helpen onze Service te exploiteren:",
          table: {
            headers: ["Type", "Voorbeeldactiviteit"],
            rows: [
              ["Hosting", "Gegevens opslaan en het platform draaien"],
              ["Analyse", "Begrijpen hoe gebruikers omgaan met de app"],
              ["Betaling", "Transacties veilig verwerken"],
              ["Berichten", "Meldingen en SMS verzenden"],
            ],
          },
        },
        legal: {
          title: "Wettelijk en veiligheid",
          intro: "Wij kunnen gegevens vrijgeven als dit wettelijk vereist is of om:",
          items: [
            "Te voldoen aan een juridisch proces (bijv. gerechtelijk bevel)",
            "Fraude of misbruik van onze Service te voorkomen",
            "De veiligheid van onze gebruikers en het publiek te beschermen",
          ],
        },
        business: {
          title: "Bedrijfsoverdrachten",
          content: "In het geval van een fusie, overname of verkoop van activa kunnen uw gegevens worden overgedragen aan de nieuwe eigenaar.",
        },
      },
      transfers: {
        title: "Internationale gegevensoverdrachten",
        content: [
          "BuyOrSell is gevestigd in de Verenigde Arabische Emiraten, maar we kunnen servers gebruiken die zich in Europa, de VS of elders bevinden.",
          "Uw informatie kan worden overgedragen naar en onderhouden op computers die zich buiten uw staat of land bevinden.",
        ],
        items: [
          "Standard Contractual Clauses (SCC's)",
          "Adequaatheidbesluiten waar van toepassing",
        ],
        outro: "Wij nemen alle redelijkerwijs noodzakelijke stappen om ervoor te zorgen dat uw gegevens veilig worden behandeld.",
      },
      retention: {
        title: "Gegevensbewaring",
        intro: "We bewaren uw gegevens zolang dit nodig is om de Service te leveren:",
        table: {
          headers: ["Gegevenstype", "Bewaartermijn"],
          rows: [
            ["Accountinformatie", "Totdat het account wordt verwijderd"],
            ["Advertenties", "Totdat ze worden verwijderd of 1 jaar na verloop"],
            ["Berichten", "Tot 5 jaar (voor veiligheid/wettelijk)"],
            ["Logs", "90 dagen tot 1 jaar"],
          ],
        },
        outro: "Na afloop van de periode verwijderen of anonimiseren we de gegevens.",
      },
      security: {
        title: "Beveiliging",
        intro: "We gebruiken standaard beveiligingsmaatregelen om uw gegevens te beschermen:",
        items: [
          "Secure Socket Layer (SSL) encryptie voor alle gegevensoverdrachten",
          "Regelmatige beveiligingsaudits en kwetsbaarheidsscans",
          "Strenge toegangscontroles om onbevoegde toegang tot gegevens te voorkomen",
        ],
      },
      yourRights: {
        title: "9. Uw rechten op gegevensbescherming",
        intro: "Onder de federale wet van de VAE nr. 45/2021 (PDPL) en de toepasselijke wetgeving heeft u de volgende rechten met betrekking tot uw persoonlijke gegevens:",
        table: {
          headers: ["Recht", "Wat het betekent"],
          rows: [
            ["Recht op inzage", "Vraag een kopie aan van de persoonlijke gegevens die wij over u bewaren."],
            ["Recht op rectificatie", "Vraag om correctie van onjuiste of onvolledige persoonlijke gegevens."],
            ["Recht op gegevenswissing", "Vraag om verwijdering van uw persoonlijke gegevens wanneer deze niet langer nodig zijn."],
            ["Recht op beperking", "Verzoek dat wij de verwerking van uw gegevens in bepaalde omstandigheden beperken."],
            ["Recht van bezwaar", "Maak bezwaar tegen verwerking op basis van gerechtvaardigde belangen."],
            ["Recht om toestemming in te trekken", "Trek uw toestemming op elk gewenst moment in voor verwerkingen op basis van toestemming."],
          ],
        },
        outro: "Vraag een aanvraag in door een e-mail te sturen naar contact@buyorsell.ae met de onderwerpregel 'Data Subject Request'. Wij reageren binnen 7-15 werkdagen.",
        accountSelfService: "Veel rechten kunnen rechtstreeks binnen het platform worden uitgeoefend via Accountinstellingen → Privacy.",
      },
      cookies: {
        title: "10. Cookies en trackingtechnologieën",
        intro: "Wij gebruiken cookies en soortgelijke trackingtechnologieën om het platform te exploiteren en te verbeteren. Raadpleeg voor volledige details ons Cookiebeleid in Sectie 14 van onze Algemene Voorwaarden.",
        outro: "U kunt uw cookievoorkeuren op elk moment bijwerken via Accountinstellingen → Privacy → Cookievoorkeuren.",
      },
      children: {
        title: "11. Privacy van kinderen",
        intro: "Het platform is bedoeld voor gebruikers van 18 jaar en ouder. Wij verzamelen niet bewust persoonlijke gegevens van kinderen onder de 18 jaar.",
        middle: "Als we merken dat we persoonlijke gegevens hebben verzameld van een kind jonger dan 18 jaar zonder passende toestemming van de ouders, zullen we onmiddellijk stappen ondernemen om die gegevens te verwijderen.",
        outro: "Als u denkt dat uw kind persoonlijke gegevens aan ons heeft verstrekt, neem dan contact met ons op via support@buyorsell.ae.",
        compliance: "Wij voldoen aan de UAE Child Digital Safety Law en tonen geen gedragsadvertenties aan gebruikers onder de 18 jaar.",
      },
      thirdParty: {
        title: "12. Websites en diensten van derden",
        intro: "Het platform kan links bevatten naar websites van derden, social media platforms of diensten die niet door ons worden beheerd.",
        middle: "Dit privacybeleid is niet van toepassing op die diensten van derden. Wij zijn niet verantwoordelijk voor hun privacypraktijken of inhoud.",
        outro: "Wanneer u social login gebruikt (Google of Apple), is ook het privacybeleid van het betreffende platform van toepassing.",
      },
      changes: {
        title: "13. Wijzigingen in dit privacybeleid",
        intro: "We kunnen dit privacybeleid van tijd tot tijd bijwerken. We zullen u op de hoogte stellen van materiële wijzigingen door:",
        items: [
          "Het bijgewerkte beleid op het platform te plaatsen met een herziene 'Laatst bijgewerkt'-datum.",
          "Een e-mailmelding te sturen naar uw geregistreerde e-mailadres voor belangrijke wijzigingen.",
        ],
        outro: "Uw voortgezet gebruik van het platform na eventuele wijzigingen houdt in dat u akkoord gaat met het bijgewerkte beleid.",
      },
      contact: {
        title: "14. Neem contact met ons op",
        intro: "Als u vragen heeft over dit privacybeleid of uw gegevens, neem dan contact met ons op:",
        dpo: "Functionaris voor gegevensbescherming - BuyOrSell.ae",
        company: "Souq Labs Technologies LLC SPC",
        address: "Abu Dhabi, Verenigde Arabische Emiraten",
        email: "contact@buyorsell.ae",
        support: "support@buyorsell.ae",
        phone: "+971 2 675 6766",
        responseTime: "Wij reageren op alle privacyverzoeken binnen 7-15 werkdagen.",
      },
    },
  },
};
