import { Metadata } from "next";
import { Footer } from "@/components/global/footer";
import JobHomeComponent from "./_components/job-home-component";

export const metadata: Metadata = {
  title: "Jobs - Find Your Dream Job Today | BuyOrSell",
  description:
    "Connecting Talent with Opportunity: Your Gateway to Career Success. Browse featured jobs, apply to positions, and manage your job applications.",
  keywords: [
    "jobs UAE",
    "career opportunities",
    "job search",
    "employment UAE",
    "job listings",
    "career success",
  ],
};

export default function JobsHomePage() {
  return (
    <main className="bg-white">
      <JobHomeComponent />
    </main>
  );
}
