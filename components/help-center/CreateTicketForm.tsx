"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useCreateTicket } from "@/hooks/useTickets";
import { QueryType, Priority } from "@/lib/firebase/tickets/types";
import { QueryTypeSelector } from "./QueryTypeSelector";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

interface FormData {
  subject: string;
  message: string;
  queryType: QueryType;
  priority: Priority;
}

export function CreateTicketForm() {
  const { createTicket, isLoading } = useCreateTicket();
  const session = useAuthStore((state) => state.session);
  const router = useRouter();
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      queryType: "technical",
      priority: "medium",
    },
  });

  useEffect(() => {
    if (typeParam === "custom_planning") {
      setValue("queryType", "custom_planning");
      setValue("priority", "urgent");
      setValue("subject", "Custom Planning Request");
      setValue(
        "message",
        "I am interested in a custom enterprise plan with the following requirements:\n\n- Estimate monthly postings:\n- Specific categories needed:\n- Team size/Accounts:\n- Integration requirements:\n\nPlease contact me to discuss a tailored solution.",
      );
    }
  }, [typeParam, setValue]);

  const queryType = watch("queryType");
  const isCustomPlanning = queryType === "custom_planning";

  const onSubmit = async (data: FormData) => {
    // Check for user ID, handling potential different auth structures or partial session load
    const user = session?.user;
    const userId = user && user._id;

    if (!userId) {
      toast.error("You must be logged in to create a ticket");
      return;
    }

    try {
      const ticket = await createTicket({
        userId: userId,
        subject: data.subject,
        message: data.message,
        queryType: data.queryType,
        priority: data.priority,
        metadata: {
          userAgent:
            typeof navigator !== "undefined" ? navigator.userAgent : "",
          platform: typeof navigator !== "undefined" ? navigator.platform : "",
        },
      });

      toast.success("Ticket created successfully");
      router.push(`/help-centre/ticket/${ticket.id}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to create ticket. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm border border-gray-100"
    >
      <div>
        <h2 className="text-xl font-bold mb-1 text-gray-900">
          Create New Support Ticket
        </h2>
        <p className="text-sm text-gray-500">
          Describe your issue and we'll help you resolve it.
        </p>
      </div>

      {isCustomPlanning && (
        <div className="bg-purple-50 border border-purple-100 p-4 rounded-xl flex items-start gap-3">
          <div className="size-8 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
            <span className="text-purple-600 font-bold">!</span>
          </div>
          <div>
            <h4 className="text-purple-900 font-bold text-sm">
              Enterprise Custom Planning
            </h4>
            <p className="text-purple-700 text-xs mt-0.5">
              This request will be marked as **Urgent** and prioritized by our
              administration team for tailored solution design.
            </p>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Query Type</label>
        <QueryTypeSelector
          value={queryType}
          onChange={(val) => setValue("queryType", val)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Subject</label>
        <Input
          {...register("subject", { required: "Subject is required" })}
          placeholder="Brief summary of the issue"
          className={errors.subject ? "border-red-500" : ""}
        />
        {errors.subject && (
          <span className="text-red-500 text-xs">
            {errors.subject.message as string}
          </span>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Message</label>
        <Textarea
          {...register("message", { required: "Message is required" })}
          placeholder="Describe your issue in detail..."
          rows={5}
          className={`w-full ${errors.message ? "border-red-500" : ""}`}
        />
        {errors.message && (
          <span className="text-red-500 text-xs">
            {errors.message.message as string}
          </span>
        )}
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white"
      >
        {isLoading ? "Creating..." : "Submit Ticket"}
      </Button>
    </form>
  );
}
