import { BannerBySlug } from "@/components/global/banner-by-slug";

export function ExploreDealsBanner() {
  return (
    <BannerBySlug 
      slug="explore-deals" 
      withOverlay 
      className="h-[380px] max-w-[338px]" 
    />
  );
}
