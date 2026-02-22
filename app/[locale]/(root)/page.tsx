import { Metadata } from 'next';
import { HomeContent } from "./_components/home-content";
import { getSeoByRoute } from "@/app/api/seo/seo.services";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params, searchParams }: Props
): Promise<Metadata> {
  const route = "/";
  try {
    const seoResponse = await getSeoByRoute(route);
    const seo = seoResponse.data;

    return {
      title: seo.title,
      description: seo.description,
      keywords: seo.keywords,
      openGraph: {
        title: seo.ogTitle || seo.title,
        description: seo.ogDescription || seo.description,
        images: seo.ogImage ? [{ url: seo.ogImage }] : [],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: seo.twitterTitle || seo.title,
        description: seo.twitterDescription || seo.description,
        images: seo.twitterImage ? [seo.twitterImage] : [],
      },
      alternates: {
        canonical: seo.canonicalUrl || '/',
      },
      robots: {
        index: seo.robots?.includes("noindex") ? false : true,
        follow: seo.robots?.includes("nofollow") ? false : true,
        googleBot: {
          index: seo.robots?.includes("noindex") ? false : true,
          follow: seo.robots?.includes("nofollow") ? false : true,
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
  } catch (error) {
    // Return default metadata if API fails or route not found
    return {
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
  }
}

export default function Home() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl md:text-6xl font-bold text-purple-700 mb-4 text-center">
        COMING SOON
      </h1>
      <p className="text-gray-600 text-lg md:text-xl text-center max-w-md">
        We're working hard to bring you something amazing. Stay tuned!
      </p>
    </div>
  );
}
