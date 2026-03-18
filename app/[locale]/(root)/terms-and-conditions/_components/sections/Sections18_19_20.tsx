import React from "react";
import { SectionWrapper } from "../SectionWrapper";
import { useLocale } from "@/hooks/useLocale";

export const Section18Suspension = () => {
  const { t } = useLocale();
  const { title, content } = t.termsAndConditions.sections.suspension;

  return (
    <SectionWrapper id="suspension" title={title} number="18">
      {content.map((paragraph, index) => (
        <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
      ))}
    </SectionWrapper>
  );
};

export const Section19Changes = () => {
  const { t } = useLocale();
  const { title, content } = t.termsAndConditions.sections.changes;

  return (
    <SectionWrapper id="changes" title={title} number="19">
      {content.map((paragraph, index) => (
        <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
      ))}
    </SectionWrapper>
  );
};

export const Section20GoverningLaw = () => {
  const { t } = useLocale();
  const { title, content } = t.termsAndConditions.sections.governingLaw;

  return (
    <SectionWrapper id="governing-law" title={title} number="20">
      {content.map((paragraph, index) => (
        <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
      ))}
    </SectionWrapper>
  );
};
