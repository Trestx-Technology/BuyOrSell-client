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
    <main className="bg-gray-100 relative flex flex-col min-h-screen">
      <div className="sticky top-0 z-50">
        <Navbar className="hidden sm:flex" />
        <CategoryNav className="hidden sm:block" />
      </div>
      <section className="w-full max-w-[1080px] mx-auto flex-1 px-4 xl:px-0">
        {children}
      </section>
      <Footer />
    </main>
  );
}
