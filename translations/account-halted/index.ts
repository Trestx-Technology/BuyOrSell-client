import { createTranslationNamespace } from "../../validations/utils";
import type { AccountHaltedTranslations } from "./types";

export const accountHaltedTranslations =
  createTranslationNamespace<AccountHaltedTranslations>({
    "en": {
      accountHalted: "Account Halted",
      haltDescription: "Your account has been temporarily halted by administration for review following reports from the community.",
      needAssistance: "Need assistance? Contact our support team:",
      emailSupport: "Email Support",
      callUs: "Call Us",
      raiseDispute: "Raise a Dispute",
      safetyFirst: "Safety First Environment",
    },
    "nl-NL": {
      accountHalted: "Account opgeschort",
      haltDescription: "Uw account is tijdelijk opgeschort door de administratie voor controle naar aanleiding van meldingen uit de gemeenschap.",
      needAssistance: "Hulp nodig? Neem contact op met ons ondersteuningsteam:",
      emailSupport: "E-mailondersteuning",
      callUs: "Bel ons",
      raiseDispute: "Een geschil openen",
      safetyFirst: "Veiligheid voorop-omgeving",
    },
    nl: {
      accountHalted: "Account opgeschort",
      haltDescription: "Uw account is tijdelijk opgeschort door de administratie voor controle naar aanleiding van meldingen uit de gemeenschap.",
      needAssistance: "Hulp nodig? Neem contact op met ons ondersteuningsteam:",
      emailSupport: "E-mailondersteuning",
      callUs: "Bel ons",
      raiseDispute: "Een geschil openen",
      safetyFirst: "Veiligheid voorop-omgeving",
    },
    ar: {
      accountHalted: "الحساب موقوف",
      haltDescription: "تم إيقاف حسابك مؤقتًا من قبل الإدارة للمراجعة بعد تقارير من المجتمع.",
      needAssistance: "هل تحتاج إلى مساعدة؟ تواصل مع فريق الدعم لدينا:",
      emailSupport: "الدعم عبر البريد",
      callUs: "اتصل بنا",
      raiseDispute: "رفع نزاع",
      safetyFirst: "بيئة الأمان أولاً",
    },
  });
