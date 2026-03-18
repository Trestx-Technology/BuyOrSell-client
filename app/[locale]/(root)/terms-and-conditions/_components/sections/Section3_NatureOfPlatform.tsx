import React from "react";
import { SectionWrapper } from "../SectionWrapper";
import { useLocale } from "@/hooks/useLocale";

export const Section3NatureOfPlatform = () => {
  const { t } = useLocale();
  const { title, content } = t.termsAndConditions.sections.natureOfPlatform;

  return (
    <SectionWrapper id="nature-of-platform" title={title} number="3">
      {content.map((paragraph, index) => (
        <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
      ))}
    </SectionWrapper>
  );
};
