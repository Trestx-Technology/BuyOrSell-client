import { Metadata } from 'next';
import { HomeContent } from "./_components/home-content";

export const metadata: Metadata = {
  title: 'BuyOrSell - Buy, Sell & Exchange Everything Online',
  description: 'Discover amazing deals on cars, properties, furniture, electronics, jobs, and more. Buy, sell, and exchange items with verified sellers across the UAE. Find your perfect deal today!',
  keywords: [
    'buy sell exchange',
    'cars for sale',
    'properties UAE',
    'furniture online',
    'electronics marketplace',
    'jobs UAE',
    'classifieds',
    'second hand items',
    'marketplace UAE',
    'verified sellers'
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
    canonical: '/',
  },
  openGraph: {
    title: 'BuyOrSell - Buy, Sell & Exchange Everything Online',
    description: 'Discover amazing deals on cars, properties, furniture, electronics, jobs, and more. Buy, sell, and exchange items with verified sellers across the UAE.',
    url: '/',
    siteName: 'BuyOrSell',
    images: [
      {
        url: 'https://dev-buyorsell.s3.me-central-1.amazonaws.com/banners/estate-banner.png',
        width: 1200,
        height: 630,
        alt: 'BuyOrSell - Online Marketplace UAE',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BuyOrSell - Buy, Sell & Exchange Everything Online',
    description: 'Discover amazing deals on cars, properties, furniture, electronics, jobs, and more. Buy, sell, and exchange items with verified sellers across the UAE.',
    images: ['https://dev-buyorsell.s3.me-central-1.amazonaws.com/banners/estate-banner.png'],
    creator: '@devbuyorsell',
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification-code',
  },
  category: 'marketplace',
};

export default function Home() {
  return <HomeContent />;
}
