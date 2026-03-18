import React from "react";
import { SectionWrapper } from "../SectionWrapper";
import { useLocale } from "@/hooks/useLocale";

export const Section2Eligibility = () => {
  const { t } = useLocale();
  const { title, content } = t.termsAndConditions.sections.eligibility;

  return (
    <SectionWrapper id="eligibility" title={title} number="2">
      {content.map((paragraph, index) => (
        <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
      ))}
    </SectionWrapper>
  );
};
