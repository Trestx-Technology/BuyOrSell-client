import React from "react";
import { SectionWrapper } from "../SectionWrapper";
import { useLocale } from "@/hooks/useLocale";

export const Section15Disclaimer = () => {
  const { t } = useLocale();
  const { title, content } = t.termsAndConditions.sections.disclaimer;

  return (
    <SectionWrapper id="disclaimer" title={title} number="15">
      {content.map((paragraph, index) => (
        <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
      ))}
    </SectionWrapper>
  );
};

export const Section16Liability = () => {
  const { t } = useLocale();
  const { title, content } = t.termsAndConditions.sections.liability;

  return (
    <SectionWrapper id="liability" title={title} number="16">
      {content.map((paragraph, index) => (
        <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
      ))}
    </SectionWrapper>
  );
};

export const Section17Indemnity = () => {
  const { t } = useLocale();
  const { title, content } = t.termsAndConditions.sections.indemnity;

  return (
    <SectionWrapper id="indemnity" title={title} number="17">
      {content.map((paragraph, index) => (
        <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
      ))}
    </SectionWrapper>
  );
};
