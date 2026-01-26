import MyAppliedJobs from "./_components/my-applied-jobs"

export const metadata = {
      title: "BuyOrSell - Applied Jobs",
      description: "Applied Jobs",
      keywords: ["Applied Jobs", "Buy or Sell", "Jobs", "Applied Jobs"],
      openGraph: {
            title: "BuyOrSell - Applied Jobs",
            description: "Applied Jobs",
            type: "website",
            locale: "en-US",
            siteName: "Buy or Sell",
      },
      twitter: {
            title: "BuyOrSell - Applied Jobs",
            description: "Applied Jobs",
            card: "summary_large_image",
      },
      icons: {
            icon: "/favicon.ico",
      },
}

export default function AppliedJobs() {
      return <MyAppliedJobs />
}