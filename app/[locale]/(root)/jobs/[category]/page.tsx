import ViewJobPage from "./_components/page";


export const metadata = {
      title: "BuyOrSell - View Job",
      description: "View Job",
      keywords: ["View Job", "Buy or Sell", "Jobs", "View Job"],
      openGraph: {
            title: "BuyOrSell - View Job",
            description: "View Job",
            type: "website",
            locale: "en-US",
            siteName: "Buy or Sell",
      },
      twitter: {
            title: "BuyOrSell - View Job",
            description: "View Job",
            card: "summary_large_image",
      },
      icons: {
            icon: "/favicon.ico",
      },
}

export default function JobCategoryPage() {
      return <ViewJobPage />
}