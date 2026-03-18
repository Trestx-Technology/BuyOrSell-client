import React from "react";
import { SectionWrapper } from "../SectionWrapper";
import { useLocale } from "@/hooks/useLocale";

export const Annex1Property = () => {
  const { t } = useLocale();
  const { title, content } = t.termsAndConditions.sections.annex1Property;

  return (
    <SectionWrapper id="annex-1-property" title={title} className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
      {content.map((paragraph, index) => (
        <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
      ))}
    </SectionWrapper>
  );
};

export const Annex2Motors = () => {
  const { t } = useLocale();
  const { title, content } = t.termsAndConditions.sections.annex2Motors;

  return (
    <SectionWrapper id="annex-2-motors" title={title} className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
      {content.map((paragraph, index) => (
        <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
      ))}
    </SectionWrapper>
  );
};

export const Annex3Jobs = () => {
  const { t } = useLocale();
  const { title, content } = t.termsAndConditions.sections.annex3Jobs;

  return (
    <SectionWrapper id="annex-3-jobs" title={title} className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
      {content.map((paragraph, index) => (
        <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
      ))}
    </SectionWrapper>
  );
};
