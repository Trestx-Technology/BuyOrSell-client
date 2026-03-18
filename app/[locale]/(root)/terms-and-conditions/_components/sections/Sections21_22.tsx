import React from "react";
import { SectionWrapper } from "../SectionWrapper";
import { useLocale } from "@/hooks/useLocale";

export const Section21Miscellaneous = () => {
  const { t } = useLocale();
  const { title, content } = t.termsAndConditions.sections.miscellaneous;

  return (
    <SectionWrapper id="miscellaneous" title={title} number="21">
      {content.map((paragraph, index) => (
        <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
      ))}
    </SectionWrapper>
  );
};

export const Section22ContactUs = () => {
  const { t } = useLocale();
  const { title, content } = t.termsAndConditions.sections.contact;

  return (
    <SectionWrapper id="contact" title={title} number="22" className="text-center pt-10">
      {content.map((paragraph, index) => (
        <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
      ))}
    </SectionWrapper>
  );
};
