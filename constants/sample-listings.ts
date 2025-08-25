import { StaticImageData } from "next/image";
import { banners } from "./banners";

export interface ListingItem {
  id: string;
  image: string | StaticImageData;
  title: string;
  location: string;
  currentPrice: string;
  originalPrice?: string;
  discount?: string;
  transmission: string;
  fuelType: string;
  mileage: string;
  year: string;
  timeAgo: Date;
  isFavorite?: boolean;
}

export const sampleListings: ListingItem[] = [
  {
    id: "1",
    image: banners[0].image,
    title: "BMW 5 Series 2023",
    location: "Business Bay, Dubai",
    currentPrice: "105,452",
    originalPrice: "125,000",
    discount: "12%",
    transmission: "Automatic",
    fuelType: "Petrol",
    mileage: "35,000 KM",
    year: "2023",
    timeAgo: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    isFavorite: false,
  },
  {
    id: "2",
    image: banners[1].image,
    title: "Mercedes C-Class 2022",
    location: "Marina, Dubai",
    currentPrice: "95,000",
    originalPrice: "110,000",
    discount: "14%",
    transmission: "Automatic",
    fuelType: "Petrol",
    mileage: "28,500 KM",
    year: "2022",
    timeAgo: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    isFavorite: true,
  },
  {
    id: "3",
    image: banners[2].image,
    title: "Audi A4 2023",
    location: "Downtown, Dubai",
    currentPrice: "88,500",
    transmission: "Automatic",
    fuelType: "Petrol",
    mileage: "22,000 KM",
    year: "2023",
    timeAgo: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    isFavorite: false,
  },
  {
    id: "4",
    image: banners[0].image,
    title: "Lexus ES 2022",
    location: "Palm Jumeirah, Dubai",
    currentPrice: "120,000",
    originalPrice: "135,000",
    discount: "11%",
    transmission: "Automatic",
    fuelType: "Hybrid",
    mileage: "18,750 KM",
    year: "2022",
    timeAgo: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    isFavorite: false,
  },
  {
    id: "5",
    image: banners[1].image,
    title: "Volkswagen Golf 2023",
    location: "JBR, Dubai",
    currentPrice: "65,000",
    transmission: "Automatic",
    fuelType: "Petrol",
    mileage: "12,300 KM",
    year: "2023",
    timeAgo: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    isFavorite: true,
  },
  {
    id: "6",
    image: banners[2].image,
    title: "Toyota Camry 2022",
    location: "Sheikh Zayed Road, Dubai",
    currentPrice: "75,500",
    originalPrice: "82,000",
    discount: "8%",
    transmission: "Automatic",
    fuelType: "Petrol",
    mileage: "31,200 KM",
    year: "2022",
    timeAgo: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    isFavorite: false,
  },
];
