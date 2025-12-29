"use client";

import React, { useState, useCallback, useRef } from "react";
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
import { FileText, Upload, Edit, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUploadResume } from "@/hooks/useJobseeker";

interface BasicDetailsProps {
  form: UseFormReturn<JobseekerProfile>;
}

export default function BasicDetails({ form }: BasicDetailsProps) {
  const { register, watch, setValue } = form;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [workStatus, setWorkStatus] = useState<string>("experienced");
  const [experienceYears, setExperienceYears] = useState<string>("");
  const [experienceMonths, setExperienceMonths] = useState<string>("");
  const [salaryBreakdown, setSalaryBreakdown] = useState<string>("all-fixed");
  const [locationType, setLocationType] = useState<string>("");
  const [currentSalary, setCurrentSalary] = useState<string>("");
  const [isEditingMobile, setIsEditingMobile] = useState<boolean>(false);
  const [isEditingEmail, setIsEditingEmail] = useState<boolean>(false);
  const [noticePeriod, setNoticePeriod] = useState<string>("15-days");
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const uploadResumeMutation = useUploadResume();

  const handleResumeUpload = useCallback(
    async (file: File) => {
      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/jpeg",
        "image/jpg",
      ];
      if (!allowedTypes.includes(file.type)) {
        alert("Please upload a PDF, DOC, DOCX, or JPEG file");
        return;
      }

      // Validate file size (2MB max)
      if (file.size > 2 * 1024 * 1024) {
        alert("File size must be less than 2MB");
        return;
      }

      setResumeFile(file);
      try {
        const response = await uploadResumeMutation.mutateAsync(file);
        if (response?.data?.resumeUrl) {
          setValue("resumeFileUrl", response.data.resumeUrl);
        }
      } catch (error) {
        console.error("Error uploading resume:", error);
      }
    },
    [uploadResumeMutation, setValue]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleResumeUpload(file);
      }
    },
    [handleResumeUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) {
        handleResumeUpload(file);
      }
    },
    [handleResumeUpload]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const noticePeriodOptions = [
    { value: "15-days", label: "15 Days or less" },
    { value: "1-month", label: "1 Month" },
    { value: "2-months", label: "2 Months" },
    { value: "3-months", label: "3 Months" },
    { value: "serving", label: "Serving Notice Period" },
    { value: "immediately", label: "Immediately" },
  ];

  const salaryBreakdownOptions = [
    { value: "all-fixed", label: "All Fixed" },
    { value: "fixed-variable", label: "Fixed + Some Variable" },
    { value: "esop", label: "ESOP" },
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
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer",
            isDragging
              ? "border-purple bg-purple/10"
              : "border-purple/30 hover:border-purple/50 bg-purple/5"
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx,.jpg,.jpeg"
            onChange={handleFileSelect}
          />
          <div className="flex items-center gap-4">
            {/* Large purple circular icon with PDF symbol */}
            <div className="w-16 h-16 bg-purple rounded-full flex items-center justify-center flex-shrink-0">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <Typography variant="body-small" className="text-dark-blue mb-1">
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
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                disabled={uploadResumeMutation.isPending}
              >
                {uploadResumeMutation.isPending
                  ? "Uploading..."
                  : "Upload resume"}
              </Button>
            </div>
          </div>
          {resumeFile && (
            <Typography
              variant="caption"
              className="text-success-100 mt-3 block"
            >
              {resumeFile.name}
            </Typography>
          )}
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
          {...register("contactEmail")}
          label="Email"
          placeholder="your.email@example.com"
          type="email"
        />
      </div>

      {/* Work Status */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-dark-blue">
          Work Status
        </label>
        <RadioGroup
          value={workStatus}
          onValueChange={setWorkStatus}
          className="flex gap-6"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="fresher" id="fresher" />
            <label
              htmlFor="fresher"
              className="text-sm text-dark-blue cursor-pointer"
            >
              Fresher
            </label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="experienced" id="experienced" />
            <label
              htmlFor="experienced"
              className="text-sm text-dark-blue cursor-pointer"
            >
              Experienced
            </label>
          </div>
        </RadioGroup>
      </div>

      {/* Experience - Two Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-dark-blue">
            Experience
          </label>
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
          <label className="text-sm font-medium text-dark-blue opacity-0">
            Experience
          </label>
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
          value={currentSalary}
          onChange={(e) => setCurrentSalary(e.target.value)}
          placeholder="Enter Amount"
          type="number"
        />
      </div>

      {/* Salary Breakdown - Dropdown */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-dark-blue">
          Salary Breakdown
        </label>
        <Select value={salaryBreakdown} onValueChange={setSalaryBreakdown}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select salary breakdown" />
          </SelectTrigger>
          <SelectContent>
            {salaryBreakdownOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Location */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-dark-blue">Location</label>
        <RadioGroup
          value={locationType}
          onValueChange={setLocationType}
          className="flex gap-6"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="uae" id="uae" />
            <label
              htmlFor="uae"
              className="text-sm text-dark-blue cursor-pointer"
            >
              In UAE
            </label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="abroad" id="abroad" />
            <label
              htmlFor="abroad"
              className="text-sm text-dark-blue cursor-pointer"
            >
              Abroad
            </label>
          </div>
        </RadioGroup>
      </div>

      {/* Mobile Number */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-dark-blue">
            Mobile Number
          </label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            icon={<Edit className="w-4 h-4" />}
            iconPosition="left"
            onClick={() => setIsEditingMobile(!isEditingMobile)}
            className="text-purple hover:text-purple hover:bg-purple/10 p-0 h-auto"
          >
            Edit
          </Button>
        </div>
        <Typography variant="caption" className="text-grey-blue mb-2 block">
          Recruiters will contact you on this number.
        </Typography>
        {isEditingMobile ? (
          <Input
            {...register("contactPhone")}
            type="tel"
          />
        ) : (
          <Typography variant="body-small" className="text-purple">
            {form.getValues("contactPhone")}
          </Typography>
        )}
      </div>

      {/* Email Address */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-dark-blue">
            Email Address
          </label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            icon={<Edit className="w-4 h-4" />}
            iconPosition="left"
            onClick={() => setIsEditingEmail(!isEditingEmail)}
            className="text-purple hover:text-purple hover:bg-purple/10 p-0 h-auto"
          >
            Edit
          </Button>
        </div>
        <Typography variant="caption" className="text-grey-blue mb-2 block">
          We will send relevant jobs and updates to this email.
        </Typography>
        {isEditingEmail ? (
          <Input
              {...register("contactEmail")}
            type="email"
          />
        ) : (
          <Typography variant="body-small" className="text-purple">
            {form.getValues("contactEmail")}
          </Typography>
        )}
      </div>

      {/* Notice Period */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-dark-blue">
          Notice Period
        </label>
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
                  : "bg-[#F2F4F7] text-dark-blue hover:bg-grey-blue/20 border border-transparent"
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
