import React from "react";
import { SectionWrapper } from "../SectionWrapper";
import { useLocale } from "@/hooks/useLocale";

export const Section1Introduction = () => {
  const { t } = useLocale();
  const { title, content } = t.termsAndConditions.sections.introduction;

  return (
    <SectionWrapper id="introduction" title={title} number="1">
      {content.map((paragraph, index) => (
        <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
      ))}
    </SectionWrapper>
  );
};
