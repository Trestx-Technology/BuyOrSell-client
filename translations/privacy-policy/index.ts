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
          collect: "We collect information you provide, technical data, and details from third parties.",
          why: "We use your data to provide services, improve our platform, and keep BuyOrSell safe.",
          share: "We share data with service providers and for legal reasons, but we don't sell your personal info.",
          rights: "You can access, update, and manage your data settings at any time.",
          contact: "Our support team is here to help with any privacy-related concerns.",
        },
      },
      whoWeAre: {
        title: "Who We Are",
        content: [
          "BuyOrSell.ae (\"we,\" \"us,\" or \"our\") is property of Trestx Technology LLC, a company registered in Dubai, United Arab Emirates.",
          "We operate the BuyOrSell.ae website and mobile application (collectively, the \"Service\").",
        ],
      },
      scope: {
        title: "Scope of this Policy",
        intro: "This Privacy Policy explains how we collect and use personal data when you:",
        items: [
          "Visit or use our website (BuyOrSell.ae)",
          "Use our mobile application",
          "Communicate with us via email, chat, or phone",
          "Interact with our advertisements on third-party platforms",
        ],
        outro: "By using our Service, you agree to the collection and use of information in accordance with this policy.",
      },
      dataWeCollect: {
        title: "Data We Collect",
        intro: "Personal data means any information that identifies you.",
        direct: {
          title: "Information You Provide Directly",
          table: {
            headers: ["Category", "Examples"],
            rows: [
              ["Account Info", "Name, email, phone number, password"],
              ["Profile Details", "Profile picture, location, bio"],
              ["Ad Content", "Titles, descriptions, photos, videos you post"],
              ["Verification", "Emirates ID details (if you verify your account)"],
              ["Communications", "Messages sent through our chat system"],
            ],
          },
        },
        automatic: {
          title: "Information Collected Automatically",
          intro: "When you use BuyOrSell, we automatically collect certain technical information:",
          items: [
            "Log Data: IP address, browser type, pages viewed",
            "Device Data: Device model, operating system, unique IDs",
            "Location Data: Approximate location based on IP or GPS (with permission)",
            "Usage Data: Features used, search terms, interaction with ads",
          ],
        },
        thirdParty: {
          title: "Information from Third Parties",
          items: [
            "Social Media: If you log in via Google, Facebook, or Apple",
            "Partners: Fraud prevention services and marketing partners",
          ],
        },
      },
      howWeUse: {
        title: "How We Use Your Data",
        intro: "We process your data for the following purposes:",
        table: {
          headers: ["Purpose", "Legal Basis"],
          rows: [
            ["Provide Service", "Contractual necessity"],
            ["Safety & Security", "Legitimate interest"],
            ["Personalization", "Legitimate interest"],
            ["Marketing", "Consent (where required)"],
            ["Compliance", "Legal obligation"],
          ],
        },
        optOut: "You can opt-out of marketing communications at any time through your settings.",
      },
      howWeShare: {
        title: "How We Share Your Data",
        intro: "We do not sell your personal data. We share it only as described below:",
        visible: {
          title: "Visible to Other Users",
          intro: "Certain information is visible to others using the Service:",
          items: [
            "Your public profile (name, join date, rating)",
            "Content of your ads (title, description, photos)",
            "Your approximate location (if shared in an ad)",
          ],
          caution: "Avoid sharing private phone numbers or addresses within ad descriptions.",
        },
        serviceProviders: {
          title: "Service Providers",
          intro: "We use third-party companies to help us operate our Service:",
          table: {
            headers: ["Type", "Example Activity"],
            rows: [
              ["Hosting", "Storing data and running the platform"],
              ["Analytics", "Understanding how users interact with the app"],
              ["Payment", "Processing transactions securely"],
              ["Messaging", "Sending notifications and SMS"],
            ],
          },
        },
        legal: {
          title: "Legal and Safety",
          intro: "We may disclose data if required by law or to:",
          items: [
            "Comply with a legal process (e.g., court order)",
            "Prevent fraud or abuse of our Service",
            "Protect the safety of our users and the public",
          ],
        },
        business: {
          title: "Business Transfers",
          content: "In the event of a merger, acquisition, or sale of assets, your data may be transferred to the new owner.",
        },
      },
      transfers: {
        title: "International Data Transfers",
        content: [
          "BuyOrSell is based in the United Arab Emirates, but we may use servers located in Europe, the US, or elsewhere.",
          "Your information may be transferred to and maintained on computers located outside of your state or country.",
        ],
        items: [
          "Standard Contractual Clauses (SCCs)",
          "Adequacy decisions where applicable",
        ],
        outro: "We take all steps reasonably necessary to ensure your data is treated securely.",
      },
      retention: {
        title: "Data Retention",
        intro: "We keep your data for as long as needed to provide the Service:",
        table: {
          headers: ["Data Type", "Retention Period"],
          rows: [
            ["Account Info", "Until account is deleted"],
            ["Ads", "Until deleted or 1 year after expiry"],
            ["Messages", "Up to 5 years (for safety/legal)"],
            ["Logs", "90 days to 1 year"],
          ],
        },
        outro: "After the period expires, we either delete or anonymize the data.",
      },
      security: {
        title: "Security",
        intro: "We use industry-standard security measures to protect your data:",
        items: [
          "Secure Socket Layer (SSL) encryption for all data transfers",
          "Regular security audits and vulnerability scanning",
          "Strict access controls to prevent unauthorized data access",
        ],
      },
      yourRights: { title: "9. Your Data Rights" },
      cookies: { title: "10. Cookies & Tracking" },
      children: { title: "11. Children's Privacy" },
      thirdParty: { title: "12. Third-Party Services" },
      changes: { title: "13. Changes to Policy" },
      contact: { title: "14. Contact Us" },
    },
  },
  ar: {
    title: "سياسة الخصوصية BuyOrSell.ae",
    subtitle: "كيف نجمع بياناتك الشخصية ونستخدمها ونحميها",
    lastUpdated: "آخر تحديث: فبراير 2025",
    effective: "فعال: فبراير 2025",
    navigation: "التنقل",
    assistance: {
      title: "هل تحتاج إلى مساعدة؟",
      description: "إذا كانت لديك أسئلة حول سياسة الخصوصية هذه أو ممارسات البيانات الخاصة بنا أو حقوقك، فيرجى الاتصال بنا.",
      emailSupport: "دعم البريد الإلكتروني",
    },
    sections: {
      glance: {
        title: "لمحة سريعة",
        items: {
          collect: "نجمع المعلومات التي تقدمها والبيانات الفنية والتفاصيل من أطراف ثالثة.",
          why: "نستخدم بياناتك لتقديم الخدمات وتحسين منصتنا والحفاظ على أمان BuyOrSell.",
          share: "نشارك البيانات مع مزودي الخدمة ولأسباب قانونية، لكننا لا نبيع معلوماتك الشخصية.",
          rights: "يمكنك الوصول إلى بياناتك وتحديثها وإدارتها في أي وقت من إعداداتك.",
          contact: "فريق الدعم لدينا هنا للمساعدة في أي مخاوف تتعلق بالخصوصية.",
        },
      },
      whoWeAre: {
        title: "من نحن",
        content: [
          "BuyOrSell.ae هي ملك لشركة Trestx Technology LLC، وهي شركة مسجلة في دبي، الإمارات العربية المتحدة.",
          "نحن ندير موقع BuyOrSell.ae وتطبيقات الهاتف المحمول (يشار إليها مجتمعة باسم \"الخدمة\").",
        ],
      },
      scope: {
        title: "نطاق هذه السياسة",
        intro: "توضح سياسة الخصوصية هذه كيف نجمع ونستخدم البيانات الشخصية عندما:",
        items: [
          "تزور أو تستخدم موقعنا (BuyOrSell.ae)",
          "تستخدم تطبيق الهاتف المحمول الخاص بنا",
          "تتواصل معنا عبر البريد الإلكتروني أو الدردشة أو الهاتف",
          "تتفاعل مع إعلاناتنا على منصات الطرف الثالث",
        ],
        outro: "باستخدامك للخدمة، فإنك توافق على جمع واستخدام المعلومات وفقاً لهذه السياسة.",
      },
      dataWeCollect: {
        title: "البيانات التي نجمعها",
        intro: "تعني البيانات الشخصية أي معلومات تحدد هويتك.",
        direct: {
          title: "المعلومات التي تقدمها مباشرة",
          table: {
            headers: ["الفئة", "أمثلة"],
            rows: [
              ["معلومات الحساب", "الاسم، البريد الإلكتروني، رقم الهاتف، كلمة المرور"],
              ["تفاصيل الملف الشخصي", "صورة الملف الشخصي، الموقع، السيرة الذاتية"],
              ["محتوى الإعلان", "العناوين والأوصاف والصور ومقاطع الفيديو التي تنشرها"],
              ["التحقق", "تفاصيل الهوية الإماراتية (إذا قمت بالتحقق من حسابك)"],
              ["الاتصالات", "الرسائل المرسلة من خلال نظام الدردشة الخاص بنا"],
            ],
          },
        },
        automatic: {
          title: "المعلومات التي يتم جمعها تلقائياً",
          intro: "عند استخدامك لـ BuyOrSell، نجمع تلقائياً بعض المعلومات الفنية:",
          items: [
            "بيانات السجل: عنوان IP، نوع المتصفح، الصفحات التي تمت مشاهدتها",
            "بيانات الجهاز: طراز الجهاز، نظام التشغيل، المعرفات الفريدة",
            "بيانات الموقع: الموقع التقريبي بناءً على IP أو GPS (بإذن)",
            "بيانات الاستخدام: الميزات المستخدمة، مصطلحات البحث، التفاعل مع الإعلانات",
          ],
        },
        thirdParty: {
          title: "المعلومات من أطراف ثالثة",
          items: [
            "وسائل التواصل الاجتماعي: إذا قمت بتسجيل الدخول عبر Google أو Facebook أو Apple",
            "الشركاء: خدمات منع الاحتيال وشركاء التسويق",
          ],
        },
      },
      howWeUse: {
        title: "كيف نستخدم بياناتك",
        intro: "نقوم بمعالجة بياناتك للأغراض التالية:",
        table: {
          headers: ["الغرض", "الأساس القانوني"],
          rows: [
            ["تقديم الخدمة", "الضرورة التعاقدية"],
            ["السلامة والأمن", "المصلحة المشروعة"],
            ["التخصيص", "المصلحة المشروعة"],
            ["التسويق", "الموافقة (عند الاقتضاء)"],
            ["الامتثال", "الالتزام القانوني"],
          ],
        },
        optOut: "يمكنك إلغاء الاشتراك في الاتصالات التسويقية في أي وقت من خلال إعداداتك.",
      },
      howWeShare: {
        title: "كيف نشارك بياناتك",
        intro: "نحن لا نبيع بياناتك الشخصية. نشاركها فقط كما هو موضح أدناه:",
        visible: {
          title: "مرئي للمستخدمين الآخرين",
          intro: "بعض المعلومات مرئية للآخرين الذين يستخدمون الخدمة:",
          items: [
            "ملفك الشخصي العام (الاسم، تاريخ الانضمام، التقييم)",
            "محتوى إعلاناتك (العنوان، الوصف، الصور)",
            "موقعك التقريبي (إذا تمت مشاركته في إعلان)",
          ],
          caution: "تجنب مشاركة أرقام الهواتف الخاصة أو العناوين ضمن أوصاف الإعلانات.",
        },
        serviceProviders: {
          title: "مزودو الخدمة",
          intro: "نستخدم شركات خارجية لمساعدتنا في تشغيل خدمتنا:",
          table: {
            headers: ["النوع", "نشاط مثال"],
            rows: [
              ["الاستضافة", "تخزين البيانات وتشغيل المنصة"],
              ["التحليلات", "فهم كيفية تفاعل المستخدمين مع التطبيق"],
              ["الدفع", "معالجة المعاملات بشكل آمن"],
              ["المراسلة", "إرسال الإشعارات والرسائل النصية قصيرة"],
            ],
          },
        },
        legal: {
          title: "قانوني وسلامة",
          intro: "قد نفصح عن البيانات إذا كان ذلك مطلوباً بموجب القانون أو من أجل:",
          items: [
            "الامتثال لعملية قانونية (مثل أمر محكمة)",
            "منع الاحتيال أو إساءة استخدام خدمتنا",
            "حماية سلامة مستخدمينا والجمهور",
          ],
        },
        business: {
          title: "نقل الأعمال",
          content: "في حالة الاندماج أو الاستحواذ أو بيع الأصول، قد يتم نقل بياناتك إلى المالك الجديد.",
        },
      },
      transfers: {
        title: "نقل البيانات دولياً",
        content: [
          "يقع مقر BuyOrSell في الإمارات العربية المتحدة، ولكن قد نستخدم خوادم تقع في أوروبا أو الولايات المتحدة أو أي مكان آخر.",
          "قد يتم نقل معلوماتك إلى أجهزة كمبيوتر تقع خارج ولايتك أو بلدك والاحتفاظ بها عليها.",
        ],
        items: [
          "البنود التعاقدية القياسية (SCCs)",
          "قرارات الكفاية حيثما ينطبق ذلك",
        ],
        outro: "نتخذ جميع الخطوات اللازمة لضمان معاملة بياناتك بأمان.",
      },
      retention: {
        title: "الاحتفاظ بالبيانات",
        intro: "نحتفظ ببياناتك طالما كان ذلك ضرورياً لتقديم الخدمة:",
        table: {
          headers: ["نوع البيانات", "مدة الاحتفاظ"],
          rows: [
            ["معلومات الحساب", "حتى يتم حذف الحساب"],
            ["الإعلانات", "حتى يتم حذفها أو بعد عام من انتهاء الصلاحية"],
            ["الرسائل", "حتى 5 سنوات (لأسباب تتعلق بالسلامة/القانون)"],
            ["السجلات", "من 90 يوماً إلى عام واحد"],
          ],
        },
        outro: "بعد انتهاء المدة، نقوم إما بحذف البيانات أو إخفاء هويتها.",
      },
      security: {
        title: "الأمان",
        intro: "نستخدم تدابير أمنية قياسية لحماية بياناتك:",
        items: [
          "تشفير طبقة المقابس الآمنة (SSL) لجميع عمليات نقل البيانات",
          "عمليات تدقيق أمنية منتظمة وفحص الثغرات الأمنية",
          "ضوابط وصول صارمة لمنع الوصول غير المصرح به للبيانات",
        ],
      },
      yourRights: { title: "9. حقوق بياناتك" },
      cookies: { title: "10. ملفات تعريف الارتباط والتتبع" },
      children: { title: "11. خصوصية الأطفال" },
      thirdParty: { title: "12. خدمات الطرف الثالث" },
      changes: { title: "13. التغييرات في السياسة" },
      contact: { title: "14. اتصل بنا" },
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
        title: "Wie wij zijn",
        content: [
          "BuyOrSell.ae is eigendom van Trestx Technology LLC, een geregistreerd bedrijf in Dubai, Verenigde Arabische Emiraten.",
          "Wij exploiteren de BuyOrSell.ae website en mobiele applicatie (gezamenlijk de \"Service\").",
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
      yourRights: { title: "9. Uw Gegevensrechten" },
      cookies: { title: "10. Cookies & Tracking" },
      children: { title: "11. Privacy van Kinderen" },
      thirdParty: { title: "12. Diensten van Derden" },
      changes: { title: "13. Wijzigingen in het Beleid" },
      contact: { title: "14. Neem Contact met Ons Op" },
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
        title: "Wie wij zijn",
        content: [
          "BuyOrSell.ae is eigendom van Trestx Technology LLC, een geregistreerd bedrijf in Dubai, Verenigde Arabische Emiraten.",
          "Wij exploiteren de BuyOrSell.ae website en mobiele applicatie (gezamenlijk de \"Service\").",
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
      yourRights: { title: "9. Uw Gegevensrechten" },
      cookies: { title: "10. Cookies & Tracking" },
      children: { title: "11. Privacy van Kinderen" },
      thirdParty: { title: "12. Diensten van Derden" },
      changes: { title: "13. Wijzigingen in het Beleid" },
      contact: { title: "14. Neem Contact met Ons Op" },
    },
  },
};
