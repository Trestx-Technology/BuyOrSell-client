import { Metadata } from "next";
import JobsContent from "./_components/jobs-content";

export const metadata: Metadata = {
  title: "My Profile - Jobs | BuyOrSell",
  description:
    "View and manage your jobseeker profile. Browse featured jobs, apply to positions, and manage your job applications.",
  keywords: [
    "jobs UAE",
    "career opportunities",
    "job search",
    "employment UAE",
    "job listings",
    "career success",
  ],
};

export default function MyProfilePage() {
  return <JobsContent />;
}

