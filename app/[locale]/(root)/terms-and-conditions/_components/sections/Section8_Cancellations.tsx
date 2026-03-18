import React from "react";
import { SectionWrapper } from "../SectionWrapper";
import { useLocale } from "@/hooks/useLocale";

export const Section8Cancellations = () => {
  const { t } = useLocale();
  const { title, content } = t.termsAndConditions.sections.cancellations;

  return (
    <SectionWrapper id="cancellations" title={title} number="8">
      {content.map((paragraph, index) => (
        <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
      ))}
    </SectionWrapper>
  );
};
