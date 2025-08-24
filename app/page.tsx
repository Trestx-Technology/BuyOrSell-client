import Navbar from "@/components/global/Navbar";
import CategoryNav from "@/components/global/CategoryNav";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <CategoryNav />

      {/* Main Content */}
      <div className="max-w-[1080px] mx-auto px-4 xl:px-0 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to BuyOrSell
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your trusted marketplace for buying and selling everything you need.
            From motors and property to jobs and electronics.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Buy & Sell
            </h3>
            <p className="text-gray-600">
              List your items for sale or find great deals from other users.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Secure Transactions
            </h3>
            <p className="text-gray-600">
              Safe and secure payment methods for worry-free transactions.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Local & Global
            </h3>
            <p className="text-gray-600">
              Connect with buyers and sellers in your area or worldwide.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
