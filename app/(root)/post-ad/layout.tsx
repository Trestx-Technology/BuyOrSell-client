import { Metadata } from 'next';
import { AdPostingProvider } from "./_context/AdPostingContext";

export const metadata: Metadata = {
  title: 'Post Ad - Create Free Listing | BuyOrSell',
  description: 'Post your ad for free on BuyOrSell. Sell cars, property, electronics, furniture, and more. Create your listing in minutes and reach thousands of buyers in the UAE.',
  keywords: [
    'post ad',
    'sell online',
    'create listing',
    'free classifieds',
    'sell cars UAE',
    'sell property UAE',
    'sell electronics',
    'sell furniture',
    'online marketplace UAE',
    'post free ad'
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
    canonical: '/post-ad',
  },
  openGraph: {
    title: 'Post Ad - Create Free Listing | BuyOrSell',
    description: 'Post your ad for free on BuyOrSell. Sell cars, property, electronics, furniture, and more. Create your listing in minutes and reach thousands of buyers in the UAE.',
    url: '/post-ad',
    siteName: 'BuyOrSell',
    images: [
      {
        url: 'https://dev-buyorsell.s3.me-central-1.amazonaws.com/banners/estate-banner.png',
        width: 1200,
        height: 630,
        alt: 'Post Ad on BuyOrSell - Free Classifieds UAE',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Post Ad - Create Free Listing | BuyOrSell',
    description: 'Post your ad for free on BuyOrSell. Sell cars, property, electronics, furniture, and more. Create your listing in minutes and reach thousands of buyers in the UAE.',
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
  category: 'marketplace',
};

export default function PostAdLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdPostingProvider>{children}</AdPostingProvider>;
}
