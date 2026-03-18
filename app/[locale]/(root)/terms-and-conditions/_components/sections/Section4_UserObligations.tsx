import React from "react";
import { SectionWrapper } from "../SectionWrapper";
import { useLocale } from "@/hooks/useLocale";

export const Section4UserObligations = () => {
  const { t } = useLocale();
  const { title, content } = t.termsAndConditions.sections.userObligations;

  return (
    <SectionWrapper id="user-obligations" title={title} number="4">
      {content.map((paragraph, index) => (
        <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
      ))}
    </SectionWrapper>
  );
};
