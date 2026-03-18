import React from "react";
import { SectionWrapper } from "../SectionWrapper";
import { useLocale } from "@/hooks/useLocale";

export const Section6IntellectualProperty = () => {
  const { t } = useLocale();
  const { title, content } = t.termsAndConditions.sections.intellectualProperty;

  return (
    <SectionWrapper id="intellectual-property" title={title} number="6">
      {content.map((paragraph, index) => (
        <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
      ))}
    </SectionWrapper>
  );
};
