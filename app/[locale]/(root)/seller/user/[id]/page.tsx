import { Metadata } from 'next';
import UserSellerContent from "./_components/UserSellerContent";
import { getUserById } from "@/app/api/user/user.services";
import { getSeoByRoute } from "@/app/api/seo/seo.services";

type Props = {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params, searchParams }: Props
): Promise<Metadata> {
  const { id } = await params;
  const route = `/seller/user/${id}`;

  try {
    // Try to get explicit SEO for this seller user route
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
      },
      twitter: {
        title: seo.twitterTitle || seo.title,
        description: seo.twitterDescription || seo.description,
        images: seo.twitterImage ? [seo.twitterImage] : [],
      },
      alternates: {
        canonical: seo.canonicalUrl,
      },
      robots: {
        index: seo.robots?.includes("noindex") ? false : true,
        follow: seo.robots?.includes("nofollow") ? false : true,
      },
    };
  } catch (seoError) {
    // Fallback: Fetch user details and generate metadata
    try {
      const userResponse = await getUserById(id);
      const user = userResponse.data;

      if (!user) {
        return {
          title: "User Not Found | BuyOrSell",
          description: "The requested user profile could not be found.",
        };
      }

      const fullname = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User';
      const title = `${fullname} | BuyOrSell Seller`;
      const description = `Check out ${fullname}'s profile and items for sale on BuyOrSell.`;
      const images = user.image ? [{ url: user.image }] : [];

      return {
        title: title,
        description: description,
        openGraph: {
          title: title,
          description: description,
          images: images,
        },
        twitter: {
          title: title,
          description: description,
          images: images,
        },
      };
    } catch (userError) {
      return {
        title: "Seller Profile | BuyOrSell",
        description: "View seller profile on BuyOrSell.",
      };
    }
  }
}

export default function UserSellerPage() {
  return <UserSellerContent />;
}
