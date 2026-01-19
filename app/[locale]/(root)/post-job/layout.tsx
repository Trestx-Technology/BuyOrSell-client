import { Metadata } from 'next';
import { JobPostingProvider } from "@/app/[locale]/(root)/post-job/_context/JobPostingContext";

export const metadata: Metadata = {
  title: 'Post Job - Create Free Job Listing | BuyOrSell',
  description: 'Post your job for free on BuyOrSell. Find the best candidates in UAE. Create your job listing in minutes.',
  keywords: [
    'post job',
    'hiring',
    'jobs UAE',
    'recruitment',
    'free job posting',
    'careers'
  ],
  authors: [{ name: 'BuyOrSell Team' }],
  creator: 'BuyOrSell',
  publisher: 'BuyOrSell',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://dev-buyorsell.com'),
  alternates: {
    canonical: '/post-job',
  },
  openGraph: {
    title: 'Post Job - Create Free Job Listing | BuyOrSell',
    description: 'Post your job for free on BuyOrSell. Find the best candidates in UAE. Create your job listing in minutes.',
    url: '/post-job',
    siteName: 'BuyOrSell',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Post Job - Create Free Job Listing | BuyOrSell',
    description: 'Post your job for free on BuyOrSell. Find the best candidates in UAE. Create your job listing in minutes.',
    creator: '@devbuyorsell',
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
  },
  category: 'employment',
};

export default function PostJobLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <JobPostingProvider>{children}</JobPostingProvider>;
}
