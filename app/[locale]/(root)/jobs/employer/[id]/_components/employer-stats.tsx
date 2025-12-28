"use client";

import React from "react";
import { Briefcase, Users, FileText, TrendingUp } from "lucide-react";
import { Typography } from "@/components/typography";

interface EmployerStatsProps {
  totalJobsPosted?: number;
  activeJobs?: number;
  totalApplicants?: number;
  totalEmployees?: number;
}

export default function EmployerStats({
  totalJobsPosted = 0,
  activeJobs = 0,
  totalApplicants = 0,
  totalEmployees = 0,
}: EmployerStatsProps) {
  const stats = [
    {
      icon: Briefcase,
      label: "Total Jobs Posted",
      value: totalJobsPosted,
      color: "text-purple",
      bgColor: "bg-purple/20",
    },
    {
      icon: FileText,
      label: "Active Jobs",
      value: activeJobs,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      icon: Users,
      label: "Total Applicants",
      value: totalApplicants,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      icon: TrendingUp,
      label: "Employees",
      value: totalEmployees,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-white border border-[#E2E2E2] rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <div
                className={`${stat.bgColor} ${stat.color} p-3 rounded-full`}
              >
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <Typography
                  variant="h2"
                  className="text-dark-blue font-bold text-2xl"
                >
                  {stat.value.toLocaleString()}
                </Typography>
                <Typography
                  variant="body-small"
                  className="text-[#8A8A8A] text-sm"
                >
                  {stat.label}
                </Typography>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

