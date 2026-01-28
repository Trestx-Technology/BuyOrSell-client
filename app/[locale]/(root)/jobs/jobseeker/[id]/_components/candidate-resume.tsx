"use client";

import React from "react";
import { H2, Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { JobseekerProfile } from "@/interfaces/job.types";
import { Download } from "lucide-react";
import { format } from "date-fns";

interface CandidateResumeProps {
  jobseeker: JobseekerProfile;
  onDownload?: () => void;
}

export default function CandidateResume({ jobseeker, onDownload }: CandidateResumeProps) {
  if (!jobseeker.resumeFileUrl) {
    return null;
  }

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    } else if (jobseeker.resumeFileUrl) {
      window.open(jobseeker.resumeFileUrl, "_blank");
    }
  };

  return (
    <div className="bg-white border border-[#E2E2E2] rounded-2xl p-6 md:p-8 mb-6">
      <H2
        className="text-dark-blue font-bold mb-4">
        Resume
      </H2>
      <div className="flex flex-col sm:flex-row gap-4  items-center justify-between">
        <div>
          <Typography variant="body-small" className="text-dark-blue mb-1">
            {jobseeker.resumeFileUrl.split("/").pop() || "Resume"}
          </Typography>
          <Typography variant="caption" className="text-grey-blue">
            Uploaded on{" "}
            {jobseeker.updatedAt
              ? format(new Date(jobseeker.updatedAt), "MMM d, yyyy")
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

