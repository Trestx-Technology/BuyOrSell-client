import React from "react";
import { SectionWrapper } from "../SectionWrapper";
import { useLocale } from "@/hooks/useLocale";

export const Section9UAERules = () => {
  const { t } = useLocale();
  const { title, content } = t.termsAndConditions.sections.uaeRules;

  return (
    <SectionWrapper id="uae-rules" title={title} number="9">
      {content.map((paragraph, index) => (
        <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
      ))}
    </SectionWrapper>
  );
};
