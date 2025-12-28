"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
// import { useEffect } from "react";
import { Footer } from "@/components/global/footer";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
// import { useGetJobseekerProfileById } from "@/hooks/useJobseeker";
import { JobseekerProfile } from "@/interfaces/job.types";
import { ArrowLeft } from "lucide-react";
import CandidateHeader from "./_components/candidate-header";
import CandidateBasicInfo from "./_components/candidate-basic-info";
import CandidateResume from "./_components/candidate-resume";
import CandidateEmployment from "./_components/candidate-employment";
import CandidateEducation from "./_components/candidate-education";
import CandidateSkills from "./_components/candidate-skills";
import CandidateProfileSummary from "./_components/candidate-profile-summary";
import CandidateLanguages from "./_components/candidate-languages";

// Dummy data matching Figma design
const dummyJobseeker: JobseekerProfile = {
  _id: "dummy-id",
  name: "Sameer Khan",
  email: "98sameerkhanshg@gmail.com",
  phoneNo: "0811962973",
  isVerified: true,
  professionalTitle: "UI/UX Designer",
  currentCompany: "EDGE Networks",
  bio: "Experienced UI/UX Designer with a passion for creating intuitive and engaging user experiences. Specialized in designing digital products that are both beautiful and functional. Strong background in user research, wireframing, prototyping, and design systems. Proven track record of delivering high-quality designs that improve user satisfaction and business metrics.",
  resumeUrl: "sameer.UX Designer.pdf",
  workExperience: [
    {
      _id: "exp-1",
      company: "BuyOrSell",
      position: "UI/UX Designer",
      startDate: "2020-07-01",
      endDate: undefined,
      current: true,
      description: "Led the design of multiple web and mobile applications, collaborating closely with product managers and developers. Conducted user research and usability testing to inform design decisions. Created comprehensive design systems and component libraries. Improved user engagement metrics by 40% through iterative design improvements.",
      location: "Dubai, UAE",
    },
  ],
  education: [
    {
      _id: "edu-1",
      institution: "University of Delhi",
      degree: "Masters in Commerce",
      fieldOfStudy: "Commerce",
      startDate: "2018-01-01",
      endDate: "2020-12-31",
      current: false,
      grade: "M.COM",
      description: "Specialized in Business Administration and Commerce",
    },
  ],
  skills: [
    { _id: "skill-1", name: "UI Design" },
    { _id: "skill-2", name: "Figma" },
    { _id: "skill-3", name: "Adobe XD" },
    { _id: "skill-4", name: "Prototyping" },
    { _id: "skill-5", name: "Wireframing" },
    { _id: "skill-6", name: "User Research" },
    { _id: "skill-7", name: "Design Systems" },
    { _id: "skill-8", name: "HTML" },
    { _id: "skill-9", name: "CSS" },
    { _id: "skill-10", name: "JavaScript" },
    { _id: "skill-11", name: "User Interface" },
    { _id: "skill-12", name: "User Experience" },
  ],
  profileCompletion: 85,
  lastUpdated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
};

export default function JobseekerProfilePage() {
  const params = useParams();
  const router = useRouter();
  const jobseekerId = params.id as string;

  // API call commented out - using dummy data for now
  // const { data: profileData, isLoading, error } = useGetJobseekerProfileById(jobseekerId);
  // const jobseeker = profileData?.data;

  // useEffect(() => {
  //   if (error) {
  //     const errorMessage = error.message?.toLowerCase() || "";
  //     const statusCode = (error as { status?: number })?.status;

  //     if (
  //       statusCode === 404 ||
  //       errorMessage.includes("not found") ||
  //       errorMessage.includes("jobprofile not found") ||
  //       errorMessage.includes("job profile not found")
  //     ) {
  //       router.push("/jobs/jobseeker/new");
  //     }
  //   }

  //   if (profileData?.message) {
  //     const message = profileData.message.toLowerCase();
  //     if (
  //       message.includes("not found") ||
  //       message.includes("jobprofile not found") ||
  //       message.includes("job profile not found")
  //     ) {
  //       router.push("/jobs/jobseeker/new");
  //     }
  //   }
  // }, [error, profileData, router]);

  // Using dummy data
  const jobseeker = dummyJobseeker;
  const isLoading = false;

  const handleShortlist = () => {
    // TODO: Implement shortlist functionality
    console.log("Shortlist jobseeker:", jobseekerId);
  };

  const handleReject = () => {
    // TODO: Implement reject functionality
    console.log("Reject jobseeker:", jobseekerId);
  };

  const handleDownloadResume = () => {
    if (jobseeker?.resumeUrl) {
      window.open(jobseeker.resumeUrl, "_blank");
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#F2F4F7]">
        <div className="max-w-[1280px] mx-auto px-4 py-8">
          <div className="bg-gray-200 rounded-2xl h-96 animate-pulse" />
        </div>
        <Footer />
      </main>
    );
  }

  if (!jobseeker) {
    return (
      <main className="min-h-screen bg-[#F2F4F7]">
        <div className="max-w-[1280px] mx-auto px-4 py-8">
          <div className="bg-white border border-[#E2E2E2] rounded-2xl p-8 text-center">
            <Typography variant="h1" className="text-dark-blue font-bold text-2xl mb-2">
              Profile Not Found
            </Typography>
            <Typography variant="body-small" className="text-[#8A8A8A]">
              Redirecting to create profile...
            </Typography>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F2F4F7]">
      {/* Header */}
      <div className="bg-white border-b border-[#E2E2E2]">
        <div className="max-w-[1280px] mx-auto px-4 py-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.back()}
            className="text-dark-blue p-0 h-auto hover:bg-transparent"
            icon={<ArrowLeft className="w-4 h-4" />}
            iconPosition="left"
          >
            Jobseeker Profile
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1280px] mx-auto px-4 py-8">
        {/* Candidate Header */}
        <CandidateHeader
          jobseeker={jobseeker}
          onShortlist={handleShortlist}
          onReject={handleReject}
        />

        {/* Basic Information */}
        <CandidateBasicInfo jobseeker={jobseeker} />

        {/* Resume */}
        <CandidateResume jobseeker={jobseeker} onDownload={handleDownloadResume} />

        {/* Employment */}
        <CandidateEmployment jobseeker={jobseeker} />

        {/* Education */}
        <CandidateEducation jobseeker={jobseeker} />

        {/* Key Skills */}
        <CandidateSkills jobseeker={jobseeker} />

        {/* Profile Summary */}
        <CandidateProfileSummary jobseeker={jobseeker} />

        {/* Language Details */}
        <CandidateLanguages />
      </div>

      <Footer />
    </main>
  );
}
