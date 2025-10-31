import { Metadata } from 'next';
import CategoryNav from "@/app/(root)/_components/CategoryNav";
import { HomeCarousel } from "./_components/home-carousel";
import CategoriesCarousel from "./_components/categories-carousel";
import PopularCategories from "./_components/popular-categories";
import RecentViews from "./_components/recent-views";
import HostDeals from "./_components/host-deals";
import TrendingCars from "./_components/trending-cars";
import TrendingProperties from "./_components/trending-properties";
import TrendingFurniture from "./_components/trending-furniture";
import TrendingProducts from "./_components/trending-products";
import PopularJobs from "./_components/popular-jobs";
import PopularClassifieds from "./_components/popular-classifieds";
import BusinessIndustries from "./_components/business-industries";
import { MidBannerCarousel } from "./_components/mid-banner-carousel";
import FloatingChatCTA from "@/components/global/flowting-ai-cta";
import Navbar from "@/components/global/Navbar";
import { Footer } from "@/components/global/footer";
import ExchangeDeals from "./_components/exchange-deals";

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
  const banners = [
    {
      id: 1,
      image:
        "https://dev-buyorsell.s3.me-central-1.amazonaws.com/banners/estate-banner.png",
      callToAction: "Premium Properties",
    },
    {
      id: 2,
      image:
        "https://dev-buyorsell.s3.me-central-1.amazonaws.com/banners/estate-banner.png",
      callToAction: "Luxury Real Estate",
    },
  ];
  return (
    <main className="min-h-screen">
      <Navbar />
      <CategoryNav />

      {/* Promotional Banners and Sponsored Banner */}
      <div className="max-w-[1280px] mx-auto">
        {/* Promotional Banners with Sponsored Banner */}
        <HomeCarousel />
      </div>
      <div className="max-w-[1280px] mx-auto relative">
        {/* Category Carousel */}
        <CategoriesCarousel />
        <PopularCategories />

        {/* Recent Views */}
        <RecentViews />
        <HostDeals />
        <ExchangeDeals />

        {/* PhonePe-Style Stacking Animation Container */}
        <div className="max-w-[1280px] mx-auto relative">
          <TrendingCars className="sticky top-0 z-10" />
          <TrendingProperties className="sticky top-[50px] z-20" />
          {/* New Components */}
          <TrendingFurniture className="sticky top-[150px] z-40" />
          <TrendingProducts className="sticky top-[200px] z-50" />
          <PopularJobs className="sticky top-[250px] z-60" />

          <PopularClassifieds className="sticky top-[300px] z-70" />
          <BusinessIndustries className="sticky top-[350px] z-80" />
          <MidBannerCarousel
            className="max-w-[1180px] mx-auto"
            containerClassName="sticky top-[400px] z-90"
            banners={banners}
            autoPlay={true}
            autoPlayInterval={5000}
          />
        </div>

        {/* Footer */}
        <FloatingChatCTA />
      </div>
      <Footer />
    </main>
  );
}
