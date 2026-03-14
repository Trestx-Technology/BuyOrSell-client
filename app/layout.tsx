import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "@/styles/globals.css";
import { Toaster } from "sonner";
import NextTopLoader from "nextjs-toploader";
import QueryProvider from "@/services/query-client";
import { ThemeProvider } from "@/components/provider/theme-provider";
import Script from "next/script";
import { CookieConsent } from "@/components/global/cookie-consent";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://buyorsell.ae";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "BuyOrSell - Buy, Sell & Exchange Everything Online",
    template: "%s | BuyOrSell",
  },
  description:
    "Discover amazing deals on cars, properties, furniture, electronics, jobs, and more. Buy, sell, and exchange items with verified sellers across the UAE.",
  keywords: [
    "buy sell exchange",
    "marketplace UAE",
    "classifieds",
    "cars for sale",
    "properties for sale",
    "jobs in UAE",
  ],
  authors: [{ name: "BuyOrSell Team" }],
  creator: "BuyOrSell",
  publisher: "BuyOrSell",
  alternates: {
    canonical: "./",
    languages: {
      en: "/en",
      ar: "/ar",
      "nl-NL": "/nl-NL",
      nl: "/nl",
    },
  },
  openGraph: {
    type: "website",
    locale: "en",
    url: baseUrl,
    siteName: "BuyOrSell",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BuyOrSell - Online Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@devbuyorsell",
    creator: "@devbuyorsell",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${poppins.variable} antialiased`}>
        <NextTopLoader color="#8B31E1" showSpinner={false} />
        <Toaster position="top-center" richColors duration={2000} />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <QueryProvider>{children}</QueryProvider>
          <CookieConsent />
        </ThemeProvider>

        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}
            </Script>
          </>
        )}

        {/* Microsoft Clarity */}
        {process.env.NEXT_PUBLIC_CLARITY_ID && (
          <Script id="microsoft-clarity" strategy="afterInteractive">
            {`
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_ID}");
            `}
          </Script>
        )}
      </body>
    </html>
  );
}
