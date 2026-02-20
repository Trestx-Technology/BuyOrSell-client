import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Tokens | BuyOrSell",
  description:
    "Purchase AI tokens to enhance your ads with AI-powered descriptions, translations, and more on BuyOrSell.",
  openGraph: {
    title: "AI Tokens | BuyOrSell",
    description:
      "Purchase AI tokens to enhance your ads with AI-powered descriptions, translations, and more on BuyOrSell.",
  },
};

export default function AITokensLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
