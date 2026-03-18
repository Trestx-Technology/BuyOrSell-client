import React from "react";
import { SectionWrapper } from "../SectionWrapper";
import { useLocale } from "@/hooks/useLocale";

export const Section13Privacy = () => {
  const { t } = useLocale();
  const { title, content } = t.termsAndConditions.sections.privacy;

  return (
    <SectionWrapper id="privacy" title={title} number="13" className="bg-purple/5 p-8 rounded-2xl border border-purple/10">
      {content.map((paragraph, index) => (
        <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
      ))}
    </SectionWrapper>
  );
};
