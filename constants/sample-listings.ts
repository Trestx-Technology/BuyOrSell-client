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
  endTime?: Date; // For countdown timer
  // Additional properties for better categorization
  category?:
    | "car"
    | "property"
    | "electronics"
    | "furniture"
    | "appliances"
    | "fashion"
    | "jobs"
    | "business"
    | "other";
  condition?: "new" | "used" | "refurbished";
  brand?: string;
  model?: string;
}

export const sampleListings: ListingItem[] = [
  {
    id: "1",
    image:
      "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    category: "car",
    condition: "used",
    brand: "BMW",
    model: "5 Series",
  },
  {
    id: "2",
    image:
      "https://images.unsplash.com/photo-1615141850218-9163d187fbda?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
    endTime: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours from now
    category: "car",
    condition: "used",
    brand: "Mercedes",
    model: "C-Class",
  },
  {
    id: "3",
    image:
      "https://images.unsplash.com/photo-1540066019607-e5f69323a8dc?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Audi A4 2023",
    location: "Downtown, Dubai",
    currentPrice: "88,500",
    transmission: "Automatic",
    fuelType: "Petrol",
    mileage: "22,000 KM",
    year: "2023",
    timeAgo: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    isFavorite: false,
    endTime: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
    category: "car",
    condition: "used",
    brand: "Audi",
    model: "A4",
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
    endTime: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours from now
    category: "car",
    condition: "used",
    brand: "Lexus",
    model: "ES",
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
    endTime: new Date(Date.now() + 36 * 60 * 60 * 1000), // 36 hours from now
    category: "car",
    condition: "used",
    brand: "Volkswagen",
    model: "Golf",
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
    endTime: new Date(Date.now() + 72 * 60 * 60 * 1000), // 72 hours from now
    category: "car",
    condition: "used",
    brand: "Toyota",
    model: "Camry",
  },
  {
    id: "7",
    image: banners[2].image,
    title: "Honda Civic 2023",
    location: "Al Barsha, Dubai",
    currentPrice: "68,000",
    originalPrice: "75,000",
    discount: "9%",
    transmission: "Automatic",
    fuelType: "Petrol",
    mileage: "15,800 KM",
    year: "2023",
    timeAgo: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
    isFavorite: false,
    endTime: new Date(Date.now() + 60 * 60 * 60 * 1000), // 60 hours from now
    category: "car",
    condition: "used",
    brand: "Honda",
    model: "Civic",
  },
  {
    id: "8",
    image: banners[2].image,
    title: "Nissan Altima 2022",
    location: "Dubai Silicon Oasis",
    currentPrice: "72,000",
    originalPrice: "78,000",
    discount: "8%",
    transmission: "Automatic",
    fuelType: "Petrol",
    mileage: "25,400 KM",
    year: "2022",
    timeAgo: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    isFavorite: false,
    endTime: new Date(Date.now() + 84 * 60 * 60 * 1000), // 84 hours from now
    category: "car",
    condition: "used",
    brand: "Nissan",
    model: "Altima",
  },
  {
    id: "9",
    image: banners[2].image,
    title: "Hyundai Sonata 2023",
    location: "Dubai Investment Park",
    currentPrice: "58,500",
    originalPrice: "65,000",
    discount: "10%",
    transmission: "Automatic",
    fuelType: "Petrol",
    mileage: "18,900 KM",
    year: "2023",
    timeAgo: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), // 12 days ago
    isFavorite: false,
    endTime: new Date(Date.now() + 96 * 60 * 60 * 1000), // 96 hours from now
    category: "car",
    condition: "used",
    brand: "Hyundai",
    model: "Sonata",
  },
];
