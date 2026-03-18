import React from "react";
import { SectionWrapper } from "../SectionWrapper";
import { useLocale } from "@/hooks/useLocale";

export const Section14CookiePolicy = () => {
  const { t } = useLocale();
  const { title, content } = t.termsAndConditions.sections.cookiePolicy;

  return (
    <SectionWrapper id="cookie-policy" title={title} number="14" className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-gray-100 shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-purple/5">
      {content.map((paragraph, index) => (
        <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
      ))}
    </SectionWrapper>
  );
};
