import type { Locale } from "@/lib/i18n/config";

export type AIAdPostTranslations = {
  title: string;
  placeholder: string;
  addImage: string;
  uploadImage: string;
  clickToBrowse: string;
  useTemplates: string;
  templates: string;
  templatesDescription: string;
  generating: string;
  promptTooLong: string;
  underDevelopment: string;
  howAIWorks: string;
  aiGeneration: string;
  aiGenerationDesc: string;
  templatesDesc: string;
  imageAnalysis: string;
  imageAnalysisDesc: string;
  tryTemplates: string;
  templateLabels: {
    cars: string;
    sellProperty: string;
    sellLaptop: string;
    moreExamples: string;
  };
  templateDescriptions: {
    cars: string;
    sellProperty: string;
    sellLaptop: string;
    moreExamples: string;
  };
  templateHints: {
    cars: string;
    property: string;
    electronics: string;
    more: string;
  };
  clickToApply: string;
  characters: string;
};

export type AIAdPostTranslationNamespace = Record<Locale, AIAdPostTranslations>;

