import React from "react";
import { SectionWrapper } from "../SectionWrapper";
import { useLocale } from "@/hooks/useLocale";

export const Section5ListingsAndContent = () => {
  const { t } = useLocale();
  const { title, content } = t.termsAndConditions.sections.listingsAndContent;

  return (
    <SectionWrapper id="listings-content" title={title} number="5">
      {content.map((paragraph, index) => (
        <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
      ))}
    </SectionWrapper>
  );
};
