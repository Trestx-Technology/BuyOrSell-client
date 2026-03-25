"use client";

import React, { useState } from "react";
import {
  AlertCircle,
  ChevronDown,
  ChevronLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/typography";
import Link from "next/link";
import { useLocale } from "@/hooks/useLocale";
import { useRouter } from "next/navigation";
import { useCreateReportIssue } from "@/hooks/useReportIssue";
import { toast } from "sonner";
import { Container1080 } from "@/components/layouts/container-1080";

export const ReportIssueContent = () => {
  const { localePath } = useLocale();
  const router = useRouter();
  const createReportIssueMutation = useCreateReportIssue();
  
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    description: "",
  });

  const handleInputChange =
    (field: keyof typeof formData) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.title || !formData.type || !formData.description) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      await createReportIssueMutation.mutateAsync({
        title: formData.title,
        type: formData.type,
        description: formData.description,
      });

      toast.success("Issue reported successfully! Thank you for your feedback.");

      // Reset form
      setFormData({
        title: "",
        type: "",
        description: "",
      });
      
      router.push(localePath("/")); // Redirect to home on success
    } catch (error) {
      console.error("Error submitting report issue:", error);
      toast.error("Failed to submit the issue. Please try again later.");
    }
  };

  const handleBack = () => {
    router.push(localePath("/"));
  };

  return (
    <Container1080 className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex justify-center sm:hidden border-b dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-950 z-10 py-4 shadow-sm">
        <Button
          variant={"ghost"}
          icon={<ChevronLeft className="h-4 w-4 -mr-2" />}
          iconPosition="center"
          size={"icon-sm"}
          className="absolute left-4 text-purple"
          onClick={handleBack}
        />
        <Typography variant="lg-semibold" className="text-gray-900 dark:text-white">
          Report an Issue
        </Typography>
      </div>
      
      <div className="sm:px-4 xl:px-0 flex flex-col gap-5 sm:py-8">
        <div className="hidden sm:flex items-center gap-2">
          <Link
            href={localePath("/")}
            className="text-gray-400 font-semibold text-sm hover:text-purple transition-colors"
          >
            Home
          </Link>
          <ChevronsRight className="size-6 text-purple" />
          <span className="text-purple-600 font-semibold text-sm">
            Report Issue
          </span>
        </div>

        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white sm:rounded-2xl sm:shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800 dark:bg-gray-950">
              <div className="p-8 border-b border-gray-100 dark:border-gray-800 bg-purple/5 dark:bg-purple/10 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-purple/10 dark:bg-purple/20 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="h-6 w-6 text-purple" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Report an Issue</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">If you encountered a bug or have a suggestion, let us know here.</p>
                </div>
              </div>

              <div className="p-8">
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Issue Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
                      Issue Type <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={formData.type}
                        onChange={handleInputChange("type")}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-800 rounded-lg focus:ring-2 focus:ring-purple/20 focus:border-purple bg-white dark:bg-gray-950 text-gray-900 dark:text-white text-sm appearance-none pr-10"
                        required
                      >
                        <option value="" disabled>Select the type of issue</option>
                        <option value="bug">Bug Report</option>
                        <option value="suggestion">Suggestion / Feature Request</option>
                        <option value="content">Inappropriate Content</option>
                        <option value="other">Other</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={handleInputChange("title")}
                      placeholder="Brief summary of the issue"
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-800 rounded-lg focus:ring-2 focus:ring-purple/20 focus:border-purple bg-white dark:bg-gray-950 text-gray-900 dark:text-white text-sm"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={handleInputChange("description")}
                      placeholder="Please provide as much detail as possible to help us understand the issue..."
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-800 rounded-lg focus:ring-2 focus:ring-purple/20 focus:border-purple bg-white dark:bg-gray-950 text-gray-900 dark:text-white text-sm resize-y"
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <Button
                      type="submit"
                      disabled={createReportIssueMutation.isPending}
                      className="w-full bg-purple hover:bg-purple/90 text-white rounded-xl h-12 text-base font-bold shadow-lg shadow-purple/20 transition-all disabled:opacity-50"
                      isLoading={createReportIssueMutation.isPending}
                    >
                      {createReportIssueMutation.isPending
                        ? "Submitting..."
                        : "Submit Report"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container1080>
  );
};
