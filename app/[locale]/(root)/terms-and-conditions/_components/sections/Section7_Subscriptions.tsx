import React from "react";
import { SectionWrapper } from "../SectionWrapper";
import { useLocale } from "@/hooks/useLocale";

export const Section7Subscriptions = () => {
  const { t } = useLocale();
  const { title, content } = t.termsAndConditions.sections.subscriptions;

  return (
    <SectionWrapper id="subscriptions" title={title} number="7">
      {content.map((paragraph, index) => (
        <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
      ))}
    </SectionWrapper>
  );
};
