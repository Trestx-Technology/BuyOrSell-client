import MySavedJobs from "./_components/my-saved-jobs"

export const metadata = {
      title: "BuyOrSell - Saved Jobs",
      description: "Saved Jobs",
      keywords: ["Saved Jobs", "Buy or Sell", "Jobs", "Saved Jobs"],
      openGraph: {
            title: "BuyOrSell - Saved Jobs",
            description: "Saved Jobs",
            type: "website",
            locale: "en-US",
      },
      twitter: {
            title: "BuyOrSell - Saved Jobs",
            description: "Saved Jobs",
            card: "summary_large_image",
      },
}

export default function SavedJobs() {
      return <MySavedJobs />
}
