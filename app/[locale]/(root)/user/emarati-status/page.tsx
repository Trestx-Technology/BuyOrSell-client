"use client";

import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Upload, CalendarIcon, X, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
      Popover,
      PopoverContent,
      PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Container1080 } from "@/components/layouts/container-1080";
import { MobileStickyHeader } from "@/components/global/mobile-sticky-header";
import { useUploadFile } from "@/hooks/useUploadFile";
import { useUpdateMyEmarati, useGetMyEmaratiStatus } from "@/hooks/useUsers";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { FormField } from "@/app/[locale]/(root)/post-ad/details/_components/FormField";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

// validation schema
const formSchema = z.object({
      eidNumber: z
            .string()
            .regex(/^784-\d{4}-\d{7}-\d{1}$/, "Invalid EID format (784-xxxx-xxxxxxx-x)"),
      eidExpiry: z.date({
            message: "Expiry date is required",
      }),
      eidFrontUrl: z.string().min(1, "Front side image is required"),
      eidBackUrl: z.string().min(1, "Back side image is required"),
});

type FormValues = z.infer<typeof formSchema>;

// Helper to format Emirates ID
const formatEmiratesID = (value: string) => {
      // Remove all non-digit characters
      const numbers = value.replace(/\D/g, "");

      // Ensure it doesn't exceed 15 digits
      const truncated = numbers.slice(0, 15);

      // Build the formatted string
      let formatted = truncated;

      if (truncated.length > 3) {
            formatted = `${truncated.slice(0, 3)}-${truncated.slice(3)}`;
      }
      if (truncated.length > 7) {
            formatted = `${truncated.slice(0, 3)}-${truncated.slice(3, 7)}-${truncated.slice(7)}`;
      }
      if (truncated.length > 14) {
            formatted = `${truncated.slice(0, 3)}-${truncated.slice(3, 7)}-${truncated.slice(7, 14)}-${truncated.slice(14)}`;
      }

      return formatted;
};

// Helper to get status badge
const getStatusBadge = (status?: string) => {
      switch (status) {
            case "PENDING":
                  return (
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 gap-1">
                              <Clock className="w-3 h-3" /> Pending Verification
                        </Badge>
                  );
            case "VERIFIED":
                  return (
                        <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Verified
                        </Badge>
                  );
            case "REJECTED":
                  return (
                        <Badge variant="destructive" className="gap-1">
                              <AlertCircle className="w-3 h-3" /> Rejected
                        </Badge>
                  );
            default:
                  return null;
      }
};

export default function EmaratiStatusPage() {
      const router = useRouter();
      const { upload: uploadFront, isUploading: isUploadingFront } = useUploadFile();
      const { upload: uploadBack, isUploading: isUploadingBack } = useUploadFile();
      const { mutateAsync: updateEmarati, isPending } = useUpdateMyEmarati();

      // Use the new GET API hook
      const { data: emaratiStatusData, isLoading: isLoadingStatus } = useGetMyEmaratiStatus();

      const {
            control,
            handleSubmit,
            setValue,
            formState: { errors },
      } = useForm<FormValues>({
            resolver: zodResolver(formSchema),
            defaultValues: {
                  eidNumber: "",
                  eidFrontUrl: "",
                  eidBackUrl: "",
            },
      });

      // Pre-fill form if data exists
      useEffect(() => {
            if (emaratiStatusData?.data?.emaratiDetails) {
                  try {
                        const details = typeof emaratiStatusData.data.emaratiDetails === 'string'
                              ? JSON.parse(emaratiStatusData.data.emaratiDetails)
                              : emaratiStatusData.data.emaratiDetails;

                        if (details.eidNumber) setValue("eidNumber", details.eidNumber);
                        if (details.eidExpiry) setValue("eidExpiry", new Date(details.eidExpiry));
                        if (details.eidFrontUrl) setValue("eidFrontUrl", details.eidFrontUrl);
                        if (details.eidBackUrl) setValue("eidBackUrl", details.eidBackUrl);
                  } catch (e) {
                        console.error("Failed to parse emarati details", e);
                  }
            }
      }, [emaratiStatusData, setValue]);

      const onSubmit = async (values: FormValues) => {
            const details = JSON.stringify({
                  eidNumber: values.eidNumber,
                  eidExpiry: format(values.eidExpiry, "yyyy-MM-dd"),
                  eidFrontUrl: values.eidFrontUrl,
                  eidBackUrl: values.eidBackUrl,
            });

            await updateEmarati({
                  status: "PENDING",
                  details: {
                        eidNumber: values.eidNumber,
                        eidExpiry: format(values.eidExpiry, "yyyy-MM-dd"),
                        eidFrontUrl: values.eidFrontUrl,
                        eidBackUrl: values.eidBackUrl,
                  },
            });

            toast.success("Emarati status updated successfully. Resubmitted for verification");

      };

      const handleFileUpload = async (
            file: File,
            fieldChange: (value: string) => void,
            uploader: (file: File) => Promise<string | null>
      ) => {
            const url = await uploader(file);
            if (url) {
                  fieldChange(url);
            }
      };

      if (isLoadingStatus) {
            return (
                  <Container1080>
                        <div className="flex items-center justify-center min-h-[60vh]">
                              <Loader2 className="w-8 h-8 animate-spin text-purple" />
                        </div>
                  </Container1080>
            );
      }

      return (
            <Container1080>
                  <MobileStickyHeader title="Update Emarati Status" />

                  <div className="mx-auto py-8 px-6 space-y-8">
                        <Breadcrumbs items={[

                              {
                                    label: "User",
                                    href: "/user",
                                    id: "2"
                              },
                              {
                                    label: "Emarati Status",
                                    href: "/user/emarati-status",
                                    id: "3"
                              },
                        ]} />
                        <div className="max-w-2xl mx-auto bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                              <div className="flex items-center justify-between mb-6">
                                    <h1 className="text-2xl font-bold text-dark-blue">
                                          Emarati Status Verification
                                    </h1>
                                    {getStatusBadge(emaratiStatusData?.data?.emaratiStatus)}
                              </div>

                              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                    {/* EID Number with Custom FormField and Controller */}
                                    <Controller
                                          name="eidNumber"
                                          control={control}
                                          render={({ field }) => (
                                                <FormField
                                                      label="Emirates ID Number"
                                                      error={errors.eidNumber?.message}
                                                >
                                                      <Input
                                                            placeholder="784-1987-1234567-1"
                                                            {...field}
                                                            onChange={(e) => {
                                                                  const formatted = formatEmiratesID(e.target.value);
                                                                  field.onChange(formatted);
                                                            }}
                                                            maxLength={18}
                                                      />
                                                </FormField>
                                          )}
                                    />

                                    {/* EID Expiry with Custom FormField and Controller */}
                                    <Controller
                                          name="eidExpiry"
                                          control={control}
                                          render={({ field }) => (
                                                <FormField
                                                      label="Expiry Date"
                                                      error={errors.eidExpiry?.message}
                                                >
                                                      <Popover>
                                                            <PopoverTrigger asChild>
                                                                  <Button
                                                                        variant={"outline"}
                                                                        className={cn(
                                                                              "w-full pl-3 text-left font-normal border-gray-200",
                                                                              !field.value && "text-muted-foreground"
                                                                        )}
                                                                        icon={<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />}
                                                                        iconPosition="left"
                                                                  >
                                                                        {field.value ? (
                                                                              format(field.value, "PPP")
                                                                        ) : (
                                                                              <span>Pick a date</span>
                                                                        )}
                                                                  </Button>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-full p-0" align="start">
                                                                  <Calendar
                                                                        mode="single"
                                                                        selected={field.value}
                                                                        onSelect={field.onChange}
                                                                        disabled={(date) =>
                                                                              date < new Date()
                                                                        }
                                                                  />
                                                            </PopoverContent>
                                                      </Popover>
                                                </FormField>
                                          )}
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                          {/* Front Image with Custom FormField and Controller */}
                                          <Controller
                                                name="eidFrontUrl"
                                                control={control}
                                                render={({ field }) => (
                                                      <FormField
                                                            label="EID Front Image"
                                                            error={errors.eidFrontUrl?.message}
                                                      >
                                                            <div className="space-y-2">
                                                                  {field.value ? (
                                                                        <div className="relative w-full h-40 rounded-lg overflow-hidden border border-gray-200">
                                                                              <Image
                                                                                    src={field.value}
                                                                                    alt="EID Front"
                                                                                    fill
                                                                                    className="object-cover"
                                                                              />
                                                                              <button
                                                                                    type="button"
                                                                                    onClick={() => field.onChange("")}
                                                                                    className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
                                                                              >
                                                                                    <X className="w-4 h-4" />
                                                                              </button>
                                                                        </div>
                                                                  ) : (
                                                                        <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                                                                              <input
                                                                                    type="file"
                                                                                    accept="image/*"
                                                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                                                    onChange={(e) => {
                                                                                          const file = e.target.files?.[0];
                                                                                          if (file) handleFileUpload(file, field.onChange, uploadFront);
                                                                                    }}
                                                                                    disabled={isUploadingFront}
                                                                              />
                                                                              {isUploadingFront ? (
                                                                                    <Loader2 className="w-8 h-8 animate-spin text-purple" />
                                                                              ) : (
                                                                                    <>
                                                                                          <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                                                                          <span className="text-sm text-gray-500">
                                                                                                Click to upload Front Side
                                                                                          </span>
                                                                                    </>
                                                                              )}
                                                                        </div>
                                                                  )}
                                                            </div>
                                                      </FormField>
                                                )}
                                          />

                                          {/* Back Image with Custom FormField and Controller */}
                                          <Controller
                                                name="eidBackUrl"
                                                control={control}
                                                render={({ field }) => (
                                                      <FormField
                                                            label="EID Back Image"
                                                            error={errors.eidBackUrl?.message}
                                                      >
                                                            <div className="space-y-2">
                                                                  {field.value ? (
                                                                        <div className="relative w-full h-40 rounded-lg overflow-hidden border border-gray-200">
                                                                              <Image
                                                                                    src={field.value}
                                                                                    alt="EID Back"
                                                                                    fill
                                                                                    className="object-cover"
                                                                              />
                                                                              <button
                                                                                    type="button"
                                                                                    onClick={() => field.onChange("")}
                                                                                    className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
                                                                              >
                                                                                    <X className="w-4 h-4" />
                                                                              </button>
                                                                        </div>
                                                                  ) : (
                                                                        <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                                                                              <input
                                                                                    type="file"
                                                                                    accept="image/*"
                                                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                                                    onChange={(e) => {
                                                                                          const file = e.target.files?.[0];
                                                                                          if (file) handleFileUpload(file, field.onChange, uploadBack);
                                                                                    }}
                                                                                    disabled={isUploadingBack}
                                                                              />
                                                                              {isUploadingBack ? (
                                                                                    <Loader2 className="w-8 h-8 animate-spin text-purple" />
                                                                              ) : (
                                                                                    <>
                                                                                          <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                                                                          <span className="text-sm text-gray-500">
                                                                                                Click to upload Back Side
                                                                                          </span>
                                                                                    </>
                                                                              )}
                                                                        </div>
                                                                  )}
                                                            </div>
                                                      </FormField>
                                                )}
                                          />
                                    </div>

                                    <div className="pt-4">
                                          <Button
                                                type="submit"
                                                className="w-full bg-purple hover:bg-purple/90"
                                                disabled={isPending || isUploadingFront || isUploadingBack}
                                                isLoading={isPending}
                                          >
                                                {emaratiStatusData?.data?.emaratiStatus === "PENDING" ? "Resubmit for Verification" : "Submit for Verification"}
                                          </Button>
                                    </div>
                              </form>
                        </div>
                  </div>
            </Container1080>
      );
}
