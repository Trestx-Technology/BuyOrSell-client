"use client";

import React from "react";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { JobseekerProfile } from "@/interfaces/job.types";
import { Download } from "lucide-react";
import { format } from "date-fns";

interface CandidateResumeProps {
  jobseeker: JobseekerProfile;
  onDownload?: () => void;
}

export default function CandidateResume({ jobseeker, onDownload }: CandidateResumeProps) {
  if (!jobseeker.resumeUrl) {
    return null;
  }

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    } else if (jobseeker.resumeUrl) {
      window.open(jobseeker.resumeUrl, "_blank");
    }
  };

  return (
    <div className="bg-white border border-[#E2E2E2] rounded-2xl p-6 md:p-8 mb-6">
      <Typography variant="h2" className="text-dark-blue font-bold text-2xl mb-4">
        Resume
      </Typography>
      <div className="flex items-center justify-between">
        <div>
          <Typography variant="body-small" className="text-dark-blue mb-1">
            {jobseeker.resumeUrl.split("/").pop() || "Resume"}
          </Typography>
          <Typography variant="caption" className="text-grey-blue">
            Uploaded on{" "}
            {jobseeker.lastUpdated
              ? format(new Date(jobseeker.lastUpdated), "MMM d, yyyy")
              : "Sep 20, 2020"}
          </Typography>
        </div>
        <Button
          onClick={handleDownload}
          variant="primary"
          icon={<Download className="w-4 h-4" />}
          iconPosition="left"
        >
          Download Resume
        </Button>
      </div>
    </div>
  );
}

