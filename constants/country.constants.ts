export interface CountryOption {
  value: string;
  label: string;
  labelAr: string;
}

export const COUNTRY_OPTIONS: CountryOption[] = [
  // --- GCC & Middle East ---
  { value: "AE", label: "United Arab Emirates", labelAr: "الإمارات العربية المتحدة" },
  { value: "SA", label: "Saudi Arabia", labelAr: "المملكة العربية السعودية" },
  { value: "QA", label: "Qatar", labelAr: "قطر" },
  { value: "KW", label: "Kuwait", labelAr: "الكويت" },
  { value: "OM", label: "Oman", labelAr: "عمان" },
  { value: "BH", label: "Bahrain", labelAr: "البحرين" },
  { value: "EG", label: "Egypt", labelAr: "مصر" },
  { value: "JO", label: "Jordan", labelAr: "الأردن" },
  { value: "LB", label: "Lebanon", labelAr: "لبنان" },
  { value: "TR", label: "Turkey", labelAr: "تركيا" },
  { value: "MA", label: "Morocco", labelAr: "المغرب" },
  { value: "DZ", label: "Algeria", labelAr: "الجزائر" },
  { value: "TN", label: "Tunisia", labelAr: "تونس" },
  { value: "IQ", label: "Iraq", labelAr: "العراق" },
  { value: "PS", label: "Palestine", labelAr: "فلسطين" },
  { value: "SY", label: "Syria", labelAr: "سوريا" },
  { value: "YE", label: "Yemen", labelAr: "اليمن" },

  // --- Asia ---
  { value: "IN", label: "India", labelAr: "الهند" },
  { value: "PK", label: "Pakistan", labelAr: "باكستان" },
  { value: "PH", label: "Philippines", labelAr: "الفلبين" },
  { value: "ID", label: "Indonesia", labelAr: "إندونيسيا" },
  { value: "MY", label: "Malaysia", labelAr: "ماليزيا" },
  { value: "SG", label: "Singapore", labelAr: "سنغافورة" },
  { value: "TH", label: "Thailand", labelAr: "تايلاند" },
  { value: "VN", label: "Vietnam", labelAr: "فيتنام" },
  { value: "CN", label: "China", labelAr: "الصين" },
  { value: "JP", label: "Japan", labelAr: "اليابان" },
  { value: "KR", label: "South Korea", labelAr: "كوريا الجنوبية" },
  { value: "BD", label: "Bangladesh", labelAr: "بنغلاديش" },
  { value: "LK", label: "Sri Lanka", labelAr: "سريلانكا" },

  // --- Europe ---
  { value: "GB", label: "United Kingdom", labelAr: "المملكة المتحدة" },
  { value: "NL", label: "Netherlands", labelAr: "هولندا" },
  { value: "DE", label: "Germany", labelAr: "ألمانيا" },
  { value: "FR", label: "France", labelAr: "فرنسا" },
  { value: "IT", label: "Italy", labelAr: "إيطاليا" },
  { value: "ES", label: "Spain", labelAr: "إسبانيا" },
  { value: "CH", label: "Switzerland", labelAr: "سويسرا" },
  { value: "SE", label: "Sweden", labelAr: "السويد" },
  { value: "NO", label: "Norway", labelAr: "النرويج" },
  { value: "DK", label: "Denmark", labelAr: "الدنمارك" },
  { value: "IE", label: "Ireland", labelAr: "أيرلندا" },
  { value: "BE", label: "Belgium", labelAr: "بلجيكا" },
  { value: "AT", label: "Austria", labelAr: "النمسا" },
  { value: "RU", label: "Russia", labelAr: "روسيا" },
  { value: "PT", label: "Portugal", labelAr: "البرتغال" },
  { value: "GR", label: "Greece", labelAr: "اليونان" },

  // --- Americas ---
  { value: "US", label: "United States", labelAr: "الولايات المتحدة" },
  { value: "CA", label: "Canada", labelAr: "كندا" },
  { value: "BR", label: "Brazil", labelAr: "البرازيل" },
  { value: "MX", label: "Mexico", labelAr: "المكسيك" },
  { value: "AR", label: "Argentina", labelAr: "الأرجنتين" },
  { value: "CO", label: "Colombia", labelAr: "كولومبيا" },
  { value: "CL", label: "Chile", labelAr: "تشيلي" },

  // --- Africa ---
  { value: "NG", label: "Nigeria", labelAr: "نيجيريا" },
  { value: "ZA", label: "South Africa", labelAr: "جنوب أفريقيا" },
  { value: "KE", label: "Kenya", labelAr: "كينيا" },
  { value: "ET", label: "Ethiopia", labelAr: "إثيوبيا" },
  { value: "GH", label: "Ghana", labelAr: "غانا" },

  // --- Oceania ---
  { value: "AU", label: "Australia", labelAr: "أستراليا" },
  { value: "NZ", label: "New Zealand", labelAr: "نيوزيلندا" },
];
