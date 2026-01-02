"use client";

import React, { useState, useCallback, useRef } from "react";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/typography";
import { cn } from "@/lib/utils";
import { useUploadFile } from "@/hooks/useUploadFile";
import { FormField } from "@/app/[locale]/(root)/post-ad/details/_components/FormField";

interface ResumeUploaderProps {
  onUploadComplete: (fileUrl: string, fileName: string) => void;
  label?: string;
  className?: string;
  initialFileName?: string;
  isRequired?: boolean;
}

const RESUME_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/jpg",
] as const;

export default function ResumeUploader({
  onUploadComplete,
  label = "Resume",
  isRequired = true,
  className,
  initialFileName,
}: ResumeUploaderProps & { isRequired?: boolean }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>(initialFileName || "");
  const [isDragging, setIsDragging] = useState(false);

  const { upload: uploadResume, isUploading: isUploadingResume } =
    useUploadFile({
      maxFileSize: 2,
      acceptedFileTypes: RESUME_FILE_TYPES as unknown as string[],
    });

  const handleResumeUpload = useCallback(
    async (file: File) => {
      setFileName(file.name);
      try {
        const resumeUrl = await uploadResume(file);
        if (resumeUrl) {
          onUploadComplete(resumeUrl, file.name);
        } else {
          setFileName("");
        }
      } catch (error) {
        console.error("Error uploading resume:", error);
        setFileName("");
      }
    },
    [uploadResume, onUploadComplete]
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

  return (
    <FormField label={label} htmlFor="resume" required={isRequired}>
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer",
          isDragging
            ? "border-purple bg-purple/10"
            : "border-purple/30 hover:border-purple/50 bg-slate-50"
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
          <div className="w-16 h-16 bg-purple rounded-full flex items-center justify-center flex-shrink-0">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1 flex flex-col">
            <Typography variant="body-small" className="text-dark-blue mb-1">
              Drag & drop file or browse from your device.
            </Typography>
            <Typography variant="caption" className="text-grey-blue mb-4">
              Support PDF, WRD, JPEG max 2MB
            </Typography>
            <div className="relative w-fit">
              <Button
                type="button"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                size={"sm"}
                className="bg-white border w-fit -mt-2"
                disabled={isUploadingResume}
              >
                {isUploadingResume
                  ? "Uploading..."
                  : fileName
                  ? fileName
                  : "Upload resume"}
              </Button>
              {/* <button
                className="absolute -top-2 -right-2 cursor-pointer hover:text-red-600 hover:scale-110 transition-all duration-300"
                onClick={() => {
                  setFileName("");
                }}
              >
                <Trash2Icon className="w-4 h-4 text-red-500" />
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </FormField>
  );
}
