import React from "react";
import { cn } from "@/lib/utils";

// Strongly typed font weights using our design system
const fontWeights = {
  thin: "font-thin", // 100
  extralight: "font-extralight", // 200
  light: "font-light", // 300
  regular: "font-normal", // 400
  medium: "font-medium", // 500
  semibold: "font-semibold", // 600
  bold: "font-bold", // 700
  extrabold: "font-extrabold", // 800
  black: "font-black", // 900
} as const;

// Font sizes using our design system (starting from 9px)
const fontSizes = {
  "3xs": "text-3xs", // 9px
  "2xs": "text-2xs", // 10px
  xs: "text-xs", // 12px
  sm: "text-sm", // 14px
  md: "text-base", // 16px
  lg: "text-lg", // 18px
  xl: "text-xl", // 20px
  "2xl": "text-2xl", // 24px
  "3xl": "text-3xl", // 30px
  "4xl": "text-4xl", // 36px
  "5xl": "text-5xl", // 48px
  "6xl": "text-6xl", // 60px
  "7xl": "text-7xl", // 72px
  "8xl": "text-8xl", // 96px
  "9xl": "text-9xl", // 128px
} as const;

// Font families from our design system
const fontFamilies = {
  inter: "font-inter",
  poppins: "font-poppins",
  sans: "font-sans", // Default system font
} as const;

// Line heights from our design system
const lineHeights = {
  none: "leading-none", // 1
  tight: "leading-tight", // 1.25
  snug: "leading-snug", // 1.375
  normal: "leading-normal", // 1.5
  relaxed: "leading-relaxed", // 1.625
  loose: "leading-loose", // 2
} as const;

// Letter spacing from our design system
const letterSpacing = {
  tighter: "tracking-tighter", // -0.05em
  tight: "tracking-tight", // -0.025em
  normal: "tracking-normal", // 0em
  wide: "tracking-wide", // 0.025em
  wider: "tracking-wider", // 0.05em
  widest: "tracking-widest", // 0.1em
} as const;

// Semantic text variants for common use cases
const semanticVariants = {
  // Headings
  "display-1": "text-6xl font-bold font-poppins",
  "display-2": "text-5xl font-bold font-poppins",
  "display-3": "text-4xl font-bold font-poppins",

  h1: "text-3xl font-bold font-inter",
  h2: "text-2xl font-semibold font-inter",
  h3: "text-xl font-semibold font-inter",
  h4: "text-lg font-medium font-inter",
  h5: "text-base font-medium font-inter",
  h6: "text-sm font-medium font-inter",

  // Body text
  "body-large": "text-lg font-normal font-inter leading-relaxed",
  body: "text-base font-normal font-inter leading-normal",
  "body-small": "text-sm font-normal font-inter leading-normal",

  // Caption and labels
  caption: "text-xs font-normal font-inter",
  label: "text-sm font-medium font-inter",

  // Special text
  quote: "text-lg font-light font-poppins italic",
  code: "text-sm font-mono font-normal",
} as const;

// Default HTML tags for semantic variants
const defaultTags = {
  // Display
  "display-1": "h1",
  "display-2": "h1",
  "display-3": "h1",

  // Headings
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",

  // Body
  "body-large": "p",
  body: "p",
  "body-small": "p",

  // Other
  caption: "span",
  label: "label",
  quote: "blockquote",
  code: "code",
} as const;

// Generate all valid custom variants as a union type
type FontWeight = keyof typeof fontWeights;
type FontSize = keyof typeof fontSizes;
type FontFamily = keyof typeof fontFamilies;
type LineHeight = keyof typeof lineHeights;
type LetterSpacing = keyof typeof letterSpacing;

export type TypographyVariant =
  | keyof typeof semanticVariants
  | `${FontSize}-${FontWeight}`
  | `${FontSize}-${FontWeight}-${FontFamily}`
  | `${FontSize}-${FontWeight}-${FontFamily}-${LineHeight}`
  | `${FontSize}-${FontWeight}-${FontFamily}-${LineHeight}-${LetterSpacing}`;

// Build styleClassMap for custom variants
const buildCustomVariant = (
  size: FontSize,
  weight: FontWeight,
  family: FontFamily = "sans",
  lineHeight: LineHeight = "normal",
  spacing: LetterSpacing = "normal"
): string => {
  return cn(
    fontSizes[size],
    fontWeights[weight],
    fontFamilies[family],
    lineHeights[lineHeight],
    letterSpacing[spacing]
  );
};

// Build styleClassMap with exact typing
const styleClassMap: Record<TypographyVariant, string> = {
  // Semantic variants
  ...semanticVariants,

  // Custom variants - size-weight combinations
  "3xs-thin": buildCustomVariant("3xs", "thin"),
  "3xs-light": buildCustomVariant("3xs", "light"),
  "3xs-regular": buildCustomVariant("3xs", "regular"),
  "3xs-medium": buildCustomVariant("3xs", "medium"),
  "3xs-semibold": buildCustomVariant("3xs", "semibold"),
  "3xs-bold": buildCustomVariant("3xs", "bold"),

  "2xs-thin": buildCustomVariant("2xs", "thin"),
  "2xs-light": buildCustomVariant("2xs", "light"),
  "2xs-regular": buildCustomVariant("2xs", "regular"),
  "2xs-medium": buildCustomVariant("2xs", "medium"),
  "2xs-semibold": buildCustomVariant("2xs", "semibold"),
  "2xs-bold": buildCustomVariant("2xs", "bold"),

  "xs-thin": buildCustomVariant("xs", "thin"),
  "xs-light": buildCustomVariant("xs", "light"),
  "xs-regular": buildCustomVariant("xs", "regular"),
  "xs-medium": buildCustomVariant("xs", "medium"),
  "xs-semibold": buildCustomVariant("xs", "semibold"),
  "xs-bold": buildCustomVariant("xs", "bold"),

  "sm-thin": buildCustomVariant("sm", "thin"),
  "sm-light": buildCustomVariant("sm", "light"),
  "sm-regular": buildCustomVariant("sm", "regular"),
  "sm-medium": buildCustomVariant("sm", "medium"),
  "sm-semibold": buildCustomVariant("sm", "semibold"),
  "sm-bold": buildCustomVariant("sm", "bold"),

  "md-thin": buildCustomVariant("md", "thin"),
  "md-light": buildCustomVariant("md", "light"),
  "md-regular": buildCustomVariant("md", "regular"),
  "md-medium": buildCustomVariant("md", "medium"),
  "md-semibold": buildCustomVariant("md", "semibold"),
  "md-bold": buildCustomVariant("md", "bold"),

  "lg-thin": buildCustomVariant("lg", "thin"),
  "lg-light": buildCustomVariant("lg", "light"),
  "lg-regular": buildCustomVariant("lg", "regular"),
  "lg-medium": buildCustomVariant("lg", "medium"),
  "lg-semibold": buildCustomVariant("lg", "semibold"),
  "lg-bold": buildCustomVariant("lg", "bold"),

  "xl-thin": buildCustomVariant("xl", "thin"),
  "xl-light": buildCustomVariant("xl", "light"),
  "xl-regular": buildCustomVariant("xl", "regular"),
  "xl-medium": buildCustomVariant("xl", "medium"),
  "xl-semibold": buildCustomVariant("xl", "semibold"),
  "xl-bold": buildCustomVariant("xl", "bold"),

  "2xl-thin": buildCustomVariant("2xl", "thin"),
  "2xl-light": buildCustomVariant("2xl", "light"),
  "2xl-regular": buildCustomVariant("2xl", "regular"),
  "2xl-medium": buildCustomVariant("2xl", "medium"),
  "2xl-semibold": buildCustomVariant("2xl", "semibold"),
  "2xl-bold": buildCustomVariant("2xl", "bold"),

  "3xl-thin": buildCustomVariant("3xl", "thin"),
  "3xl-light": buildCustomVariant("3xl", "light"),
  "3xl-regular": buildCustomVariant("3xl", "regular"),
  "3xl-medium": buildCustomVariant("3xl", "medium"),
  "3xl-semibold": buildCustomVariant("3xl", "semibold"),
  "3xl-bold": buildCustomVariant("3xl", "bold"),

  "4xl-thin": buildCustomVariant("4xl", "thin"),
  "4xl-light": buildCustomVariant("4xl", "light"),
  "4xl-regular": buildCustomVariant("4xl", "regular"),
  "4xl-medium": buildCustomVariant("4xl", "medium"),
  "4xl-semibold": buildCustomVariant("4xl", "semibold"),
  "4xl-bold": buildCustomVariant("4xl", "bold"),

  "5xl-thin": buildCustomVariant("5xl", "thin"),
  "5xl-light": buildCustomVariant("5xl", "light"),
  "5xl-regular": buildCustomVariant("5xl", "regular"),
  "5xl-medium": buildCustomVariant("5xl", "medium"),
  "5xl-semibold": buildCustomVariant("5xl", "semibold"),
  "5xl-bold": buildCustomVariant("5xl", "bold"),

  // Inter-specific variants
  "md-regular-inter": buildCustomVariant("md", "regular", "inter"),
  "lg-medium-inter": buildCustomVariant("lg", "medium", "inter"),
  "xl-semibold-inter": buildCustomVariant("xl", "semibold", "inter"),

  // Poppins-specific variants
  "md-regular-poppins": buildCustomVariant("md", "regular", "poppins"),
  "lg-medium-poppins": buildCustomVariant("lg", "medium", "poppins"),
  "xl-semibold-poppins": buildCustomVariant("xl", "semibold", "poppins"),
} as Record<TypographyVariant, string>;

interface TypographyProps {
  variant?: TypographyVariant;
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  color?: string;
}

export const Typography: React.FC<TypographyProps> = ({
  variant = "body",
  as,
  children,
  className = "",
  color,
}) => {
  // Extract the base variant to get default tag
  const baseVariant = variant.split("-")[0] as keyof typeof semanticVariants;
  const Component = as || defaultTags[baseVariant] || "p";

  // Get the style class, fallback to body if variant not found
  const styleClass = styleClassMap[variant] || styleClassMap["body"];

  // Build final className
  const finalClassName = cn(styleClass, color && `text-${color}`, className);

  return <Component className={finalClassName}>{children}</Component>;
};

// Export individual components for convenience
export const Display1: React.FC<Omit<TypographyProps, "variant">> = (props) => (
  <Typography variant="display-1" {...props} />
);

export const Display2: React.FC<Omit<TypographyProps, "variant">> = (props) => (
  <Typography variant="display-2" {...props} />
);

export const Display3: React.FC<Omit<TypographyProps, "variant">> = (props) => (
  <Typography variant="display-3" {...props} />
);

export const H1: React.FC<Omit<TypographyProps, "variant">> = (props) => (
  <Typography variant="h1" {...props} />
);

export const H2: React.FC<Omit<TypographyProps, "variant">> = (props) => (
  <Typography variant="h2" {...props} />
);

export const H3: React.FC<Omit<TypographyProps, "variant">> = (props) => (
  <Typography variant="h3" {...props} />
);

export const H4: React.FC<Omit<TypographyProps, "variant">> = (props) => (
  <Typography variant="h4" {...props} />
);

export const H5: React.FC<Omit<TypographyProps, "variant">> = (props) => (
  <Typography variant="h5" {...props} />
);

export const H6: React.FC<Omit<TypographyProps, "variant">> = (props) => (
  <Typography variant="h6" {...props} />
);

export const BodyLarge: React.FC<Omit<TypographyProps, "variant">> = (
  props
) => <Typography variant="body-large" {...props} />;

export const Body: React.FC<Omit<TypographyProps, "variant">> = (props) => (
  <Typography variant="body" {...props} />
);

export const BodySmall: React.FC<Omit<TypographyProps, "variant">> = (
  props
) => <Typography variant="body-small" {...props} />;

export const Caption: React.FC<Omit<TypographyProps, "variant">> = (props) => (
  <Typography variant="caption" {...props} />
);

export const Label: React.FC<Omit<TypographyProps, "variant">> = (props) => (
  <Typography variant="label" {...props} />
);

export const Quote: React.FC<Omit<TypographyProps, "variant">> = (props) => (
  <Typography variant="quote" {...props} />
);

export const Code: React.FC<Omit<TypographyProps, "variant">> = (props) => (
  <Typography variant="code" {...props} />
);
