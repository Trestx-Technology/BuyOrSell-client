"use client";

import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { JobseekerProfile } from "@/interfaces/job.types";
import { FileText, Upload, Edit } from "lucide-react";
import { cn } from "@/lib/utils";

interface BasicDetailsProps {
  form: UseFormReturn<JobseekerProfile>;
}

export default function BasicDetails({ form }: BasicDetailsProps) {
  const { register, watch, setValue } = form;
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [workStatus, setWorkStatus] = useState<string>("experienced");
  const [experienceYears, setExperienceYears] = useState<string>("");
  const [experienceMonths, setExperienceMonths] = useState<string>("");
  const [salaryBreakdown, setSalaryBreakdown] = useState<string>("all-fixed");
  const [locationType, setLocationType] = useState<string>("abroad");
  const [location, setLocation] = useState<string>("Gurugram, India");
  const [isEditingMobile, setIsEditingMobile] = useState<boolean>(false);
  const [isEditingEmail, setIsEditingEmail] = useState<boolean>(false);
  const [noticePeriod, setNoticePeriod] = useState<string>("15-days");

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFile(file);
      // TODO: Upload file to server and get URL
    }
  };

  const noticePeriodOptions = [
    { value: "15-days", label: "15 Days or less" },
    { value: "1-month", label: "1 Month" },
    { value: "2-months", label: "2 Months" },
    { value: "3-months", label: "3 Months" },
    { value: "serving", label: "Serving Notice Period" },
    { value: "immediately", label: "Immediately" },
  ];

  return (
    <div className="bg-white border border-[#E2E2E2] rounded-2xl p-6 md:p-8 space-y-6">
      <Typography
        variant="h2"
        className="text-dark-blue font-bold text-2xl mb-6"
      >
        Basic Details
      </Typography>

      {/* Resume Upload */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-dark-blue">Resume</label>
        <div className="border-2 border-dashed border-grey-blue/30 rounded-lg p-8 text-center hover:border-purple/50 transition-colors cursor-pointer bg-purple/5">
          <input
            type="file"
            id="resume-upload"
            className="hidden"
            accept=".pdf,.doc,.docx,.jpg,.jpeg"
            onChange={handleResumeUpload}
          />
          <label htmlFor="resume-upload" className="cursor-pointer">
            <FileText className="w-12 h-12 text-purple mx-auto mb-4" />
            <Typography variant="body-small" className="text-dark-blue mb-2">
              Drag & drop file or browse from your device.
            </Typography>
            <Typography variant="caption" className="text-grey-blue mb-4">
              Support PDF, WRD, JPEG max 2MB
            </Typography>
            <Button
              type="button"
              variant="primary"
              icon={<Upload className="w-4 h-4" />}
              iconPosition="left"
              onClick={() => document.getElementById("resume-upload")?.click()}
            >
              Upload resume
            </Button>
            {resumeFile && (
              <Typography variant="caption" className="text-success-100 mt-2 block">
                {resumeFile.name}
              </Typography>
            )}
          </label>
        </div>
      </div>

      {/* Name and Email - Two Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          {...register("name")}
          label="Name"
          placeholder="Your Full Name"
        />
        <Input
          {...register("email")}
          label="Email"
          placeholder="your.email@example.com"
          type="email"
        />
      </div>

      {/* Work Status */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-dark-blue">Work Status</label>
        <RadioGroup
          value={workStatus}
          onValueChange={setWorkStatus}
          className="flex gap-6"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="fresher" id="fresher" />
            <label htmlFor="fresher" className="text-sm text-dark-blue cursor-pointer">
              Fresher
            </label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="experienced" id="experienced" />
            <label htmlFor="experienced" className="text-sm text-dark-blue cursor-pointer">
              Experienced
            </label>
          </div>
        </RadioGroup>
      </div>

      {/* Experience - Two Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-dark-blue">Experience</label>
          <Select value={experienceYears} onValueChange={setExperienceYears}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="In Years" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 30 }, (_, i) => i).map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year} {year === 1 ? "Year" : "Years"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-dark-blue opacity-0">Experience</label>
          <Select value={experienceMonths} onValueChange={setExperienceMonths}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="In Months" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }, (_, i) => i).map((month) => (
                <SelectItem key={month} value={month.toString()}>
                  {month} {month === 1 ? "Month" : "Months"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Current Salary in Dirham (Monthly) */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-dark-blue">
          Current Salary in Dirham (Monthly)
        </label>
        <Input
          placeholder="Enter Amount"
          type="number"
        />
      </div>

      {/* Salary Breakdown */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-dark-blue">Salary Breakdown</label>
        <RadioGroup
          value={salaryBreakdown}
          onValueChange={setSalaryBreakdown}
          className="flex flex-col gap-3"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="all-fixed" id="all-fixed" />
            <label htmlFor="all-fixed" className="text-sm text-dark-blue cursor-pointer">
              All Fixed
            </label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="fixed-variable" id="fixed-variable" />
            <label htmlFor="fixed-variable" className="text-sm text-dark-blue cursor-pointer">
              Fixed + Some Variable
            </label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="esop" id="esop" />
            <label htmlFor="esop" className="text-sm text-dark-blue cursor-pointer">
              ESOP
            </label>
          </div>
        </RadioGroup>
      </div>

      {/* Location */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-dark-blue">Location</label>
        <RadioGroup
          value={locationType}
          onValueChange={setLocationType}
          className="flex gap-6 mb-3"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="uae" id="uae" />
            <label htmlFor="uae" className="text-sm text-dark-blue cursor-pointer">
              In UAE
            </label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="abroad" id="abroad" />
            <label htmlFor="abroad" className="text-sm text-dark-blue cursor-pointer">
              Abroad
            </label>
          </div>
        </RadioGroup>
        <Input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location"
        />
      </div>

      {/* Mobile Number */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-dark-blue">Mobile Number</label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            icon={<Edit className="w-4 h-4" />}
            iconPosition="left"
            onClick={() => setIsEditingMobile(!isEditingMobile)}
            className="text-purple hover:text-purple hover:bg-purple/10"
          >
            Edit
          </Button>
        </div>
        <Typography variant="caption" className="text-grey-blue mb-2 block">
          Recruiters will contact you on this number.
        </Typography>
        {isEditingMobile ? (
          <Input
            {...register("phoneNo")}
            defaultValue="+91 9811962973"
            type="tel"
          />
        ) : (
          <Typography variant="body-small" className="text-dark-blue">
            +91 9811962973
          </Typography>
        )}
      </div>

      {/* Email Address */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-dark-blue">Email Address</label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            icon={<Edit className="w-4 h-4" />}
            iconPosition="left"
            onClick={() => setIsEditingEmail(!isEditingEmail)}
            className="text-purple hover:text-purple hover:bg-purple/10"
          >
            Edit
          </Button>
        </div>
        <Typography variant="caption" className="text-grey-blue mb-2 block">
          We will send relevant jobs and updates to this email.
        </Typography>
        {isEditingEmail ? (
          <Input
            {...register("email")}
            defaultValue="98sameerkhan.sk@gmail.com"
            type="email"
          />
        ) : (
          <Typography variant="body-small" className="text-dark-blue">
            98sameerkhan.sk@gmail.com
          </Typography>
        )}
      </div>

      {/* Notice Period */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-dark-blue">Notice Period</label>
        <Typography variant="caption" className="text-grey-blue mb-3 block">
          Lets recruiters know your availability to join.
        </Typography>
        <div className="flex flex-wrap gap-2">
          {noticePeriodOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setNoticePeriod(option.value)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                noticePeriod === option.value
                  ? "bg-purple text-white"
                  : "bg-[#F2F4F7] text-dark-blue hover:bg-grey-blue/20"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

