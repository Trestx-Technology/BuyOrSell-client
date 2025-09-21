export interface DealItem {
  id: number;
  title: string;
  originalPrice: number;
  discountedPrice: number;
  discount: number;
  image: string;
  description: string;
  category: string;
  location: string;
  timeLeft: string;
}

export const deals: DealItem[] = [
  {
    id: 1,
    title: "BMW 3 Series 2022",
    originalPrice: 45000,
    discountedPrice: 38000,
    discount: 16,
    image:
      "https://dev-buyorsell.s3.me-central-1.amazonaws.com/banners/deals.png",

    description: "Excellent condition BMW 3 Series with low mileage",
    category: "Cars",
    location: "Dubai",
    timeLeft: "2 days",
  },
  {
    id: 2,
    title: "iPhone 15 Pro Max",
    originalPrice: 1200,
    discountedPrice: 950,
    discount: 21,
    image:
      "https://dev-buyorsell.s3.me-central-1.amazonaws.com/banners/deals.png",

    description: "Brand new iPhone 15 Pro Max with warranty",
    category: "Electronics",
    location: "Abu Dhabi",
    timeLeft: "5 hours",
  },
  {
    id: 3,
    title: "Gaming Laptop RTX 4070",
    originalPrice: 2500,
    discountedPrice: 2100,
    discount: 16,
    image:
      "https://dev-buyorsell.s3.me-central-1.amazonaws.com/banners/deals.png",

    description: "High-performance gaming laptop for professionals",
    category: "Electronics",
    location: "Sharjah",
    timeLeft: "1 day",
  },
  {
    id: 4,
    title: "Luxury Watch Collection",
    originalPrice: 800,
    discountedPrice: 600,
    discount: 25,
    image:
      "https://dev-buyorsell.s3.me-central-1.amazonaws.com/banners/deals.png",
    description: "Authentic luxury watches from top brands",
    category: "Fashion",
    location: "Dubai",
    timeLeft: "3 days",
  },
];
