import { Metadata } from "next";
import Navbar from "@/components/global/Navbar";
import { Footer } from "@/components/global/footer";
import CategoryNav from "@/app/[locale]/(root)/_components/CategoryNav";

export const metadata: Metadata = {
  title: "User Dashboard | BuyOrSell",
  description: "Manage your account, ads, and preferences",
};

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="bg-[#F9FAFC] min-h-screen">
      <Navbar />
      <CategoryNav />
      {children}
      <Footer />
    </main>
  );
}
