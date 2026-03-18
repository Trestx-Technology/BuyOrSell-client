import React from "react";
import { SectionWrapper } from "../SectionWrapper";
import { useLocale } from "@/hooks/useLocale";

export const Section10Reviews = () => {
  const { t } = useLocale();
  const { title, content } = t.termsAndConditions.sections.reviews;

  return (
    <SectionWrapper id="reviews" title={title} number="10">
      {content.map((paragraph, index) => (
        <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
      ))}
    </SectionWrapper>
  );
};

export const Section11Communication = () => {
  const { t } = useLocale();
  const { title, content } = t.termsAndConditions.sections.communication;

  return (
    <SectionWrapper id="communication" title={title} number="11">
      {content.map((paragraph, index) => (
        <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
      ))}
    </SectionWrapper>
  );
};

export const Section12ThirdParty = () => {
  const { t } = useLocale();
  const { title, content } = t.termsAndConditions.sections.thirdParty;

  return (
    <SectionWrapper id="third-party" title={title} number="12">
      {content.map((paragraph, index) => (
        <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
      ))}
    </SectionWrapper>
  );
};
