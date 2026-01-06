"use client";

import Image from "next/image";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Mail,
  Phone,
  Rocket,
  Briefcase,
  Clock,
  DollarSign,
  Edit,
  Ban,
  MessageCircle,
  UserPlus,
} from "lucide-react";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { JobseekerProfile } from "@/interfaces/job.types";
import { formatDistanceToNow } from "date-fns";
import { useAuthStore } from "@/stores/authStore";
import { cn } from "@/lib/utils";
import {
  useCancelConnectionRequest,
  useSendConnectionRequest,
} from "@/hooks/useConnections";
import {
  useAcceptApplication,
  useRejectApplication,
} from "@/hooks/useJobApplications";
import { toast } from "sonner";
import { ConnectionStatus } from "@/interfaces/connection.types";
import {
  JobseekerProfileHeaderActionButtons,
  JobseekerProfileHeaderType,
} from "./jobseeker-profile-header";

export interface JobseekerProfileHeaderMobileProps {
  jobseeker: JobseekerProfile;
  actions?: JobseekerProfileHeaderActionButtons;
  type?: JobseekerProfileHeaderType;
  profileCompletionPercentage?: number;
  showCompletionIndicator?: boolean;
  className?: string;
  containerClassName?: string;
  applicationId?: string;
  jobId?: string;
}

export default function JobseekerProfileHeaderMobile({
  jobseeker,
  actions,
  type: typeProp,
  profileCompletionPercentage,
  showCompletionIndicator = true,
  className,
  containerClassName,
  applicationId: applicationIdProp,
  jobId: jobIdProp,
}: JobseekerProfileHeaderMobileProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentUserId = useAuthStore((state) => state.session?.user?._id);
  const isCurrentUser = currentUserId === jobseeker.userId;

  // Get applicationId, jobId, and status from props or search params
  const applicationId = searchParams.get("applicationId");
  const jobId = jobIdProp || searchParams.get("jobId");
  const applicationStatus = searchParams.get("status");

  // Connection hooks
  const cancelConnectReq = useCancelConnectionRequest();
  const sendConnectionReq = useSendConnectionRequest();

  // Application hooks
  const acceptApplicationMutation = useAcceptApplication();
  const rejectApplicationMutation = useRejectApplication();

  // Get connection status from jobseeker profile
  const rawConnectionStatus = jobseeker.connectionStatus as
    | string
    | null
    | undefined;
  const connectionStatus: ConnectionStatus =
    rawConnectionStatus === "APPROVED" || rawConnectionStatus === "ACCEPTED"
      ? "ACCEPTED"
      : rawConnectionStatus === "PENDING"
      ? "PENDING"
      : rawConnectionStatus === "REJECTED"
      ? "REJECTED"
      : null;
  const requestId = jobseeker.requestId || null;

  // Get type from search params, fallback to prop, default to "default"
  const typeFromParams = searchParams.get("type");
  const validTypes: JobseekerProfileHeaderType[] = [
    "applicantsList",
    "profileVisit",
    "default",
  ];
  const resolvedType = typeFromParams as JobseekerProfileHeaderType;
  const type: JobseekerProfileHeaderType =
    (typeFromParams && validTypes.includes(resolvedType)
      ? resolvedType
      : typeProp) || "default";

  // Handle connection logic
  const handleConnection = async (
    status: ConnectionStatus | null,
    reqId: string | null
  ) => {
    if (status === "PENDING") {
      if (!reqId) {
        toast.error("Request ID not found");
        return;
      }
      await cancelConnectReq.mutateAsync(reqId);
      toast.success("Connection request cancelled");
    } else {
      if (!currentUserId) {
        toast.error("Please log in to send a connection request");
        return;
      }
      await sendConnectionReq.mutateAsync({
        receiverId: jobseeker.userId,
      });
      toast.success("Connection request sent");
    }
  };

  // Handle shortlist (accept application)
  const handleShortlist = async () => {
    if (!applicationId) {
      toast.error("Application ID not found");
      return;
    }

    if (!jobId) {
      toast.error("Job ID not found");
      return;
    }

    await acceptApplicationMutation.mutateAsync({
      applicationId,
      payload: {},
      jobId,
    });
    toast.success("Application shortlisted successfully");

    // Update URL with new status
    const params = new URLSearchParams(searchParams.toString());
    params.set("status", "shortlisted");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Handle reject application
  const handleReject = async () => {
    if (!applicationId) {
      toast.error("Application ID not found");
      return;
    }

    if (!jobId) {
      toast.error("Job ID not found");
      return;
    }

    await rejectApplicationMutation.mutateAsync({
      applicationId,
      payload: {},
      jobId,
    });
    toast.success("Application rejected successfully");

    // Update URL with new status
    const params = new URLSearchParams(searchParams.toString());
    params.set("status", "rejected");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const profileName = jobseeker.name || "User";
  const initials =
    profileName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "SK";
  const professionalTitle = jobseeker.headline || "";
  const currentCompany = jobseeker.experiences?.[0]?.company || "";

  // Get job preferences
  const jobType = jobseeker.preferredJobTypes?.[0] || "";

  const salaryMin = jobseeker.salaryExpectationMin || 0;
  const salaryMax = jobseeker.salaryExpectationMax || 0;
  const ctcCurrency = jobseeker.ctcCurrency || "AED";
  const availability =
    jobseeker.availability ||
    (jobseeker.noticePeriodDays
      ? `${jobseeker.noticePeriodDays} days notice`
      : "Immediately");

  const lastUpdated = jobseeker.updatedAt
    ? formatDistanceToNow(new Date(jobseeker.updatedAt || new Date()), {
        addSuffix: true,
      })
    : "";

  // Calculate experience display
  let experienceDisplay = "";
  if (jobseeker.experienceYears) {
    experienceDisplay = `${jobseeker.experienceYears} ${
      jobseeker.experienceYears === 1 ? "year" : "years"
    }`;
  } else if (jobseeker.experiences && jobseeker.experiences.length > 0) {
    const firstExp = jobseeker.experiences[0];
    if (firstExp.startDate) {
      const startDate = new Date(firstExp.startDate);
      const endDate = firstExp.endDate
        ? new Date(firstExp.endDate)
        : firstExp.isCurrent
        ? new Date()
        : null;
      if (endDate) {
        const yearsDiff =
          (endDate.getTime() - startDate.getTime()) /
          (1000 * 60 * 60 * 24 * 365);
        experienceDisplay = `${Math.floor(yearsDiff)} ${
          Math.floor(yearsDiff) === 1 ? "year" : "years"
        }`;
      }
    }
  }

  const handleEdit = () => {
    if (actions?.onEdit) {
      actions.onEdit();
    } else if (actions?.editUrl) {
      router.push(actions.editUrl);
    } else if (jobseeker._id) {
      router.push(`/jobs/jobseeker/${jobseeker._id}/edit`);
    }
  };

  return (
    <div
      className={cn(
        "bg-white border border-[#E2E2E2] rounded-2xl p-4 relative",
        containerClassName
      )}
    >
      {/* Profile Image and Name Section */}
      <div className="flex items-start gap-4 mb-4">
        {/* Profile Image Circle - Smaller for mobile */}
        <div className="relative size-20 flex-shrink-0">
          {showCompletionIndicator &&
          profileCompletionPercentage !== undefined ? (
            // Profile completion indicator version
            <>
              <svg
                className="absolute inset-0 -rotate-235"
                width="80"
                height="80"
              >
                <circle
                  cx="40"
                  cy="40"
                  r="38"
                  fill="none"
                  stroke="#F5EBFF"
                  strokeWidth="2"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="38"
                  fill="none"
                  stroke="#37E7B6"
                  strokeWidth="2"
                  strokeDasharray={`${2 * Math.PI * 38}`}
                  strokeDashoffset={`${
                    2 *
                    Math.PI *
                    38 *
                    (1 - (profileCompletionPercentage || 0) / 100)
                  }`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-[2px] rounded-full border-[3px] border-[#F5EBFF] flex items-center justify-center bg-gradient-to-br from-purple/10 to-purple/5 overflow-hidden">
                {jobseeker.photoUrl ? (
                  <Image
                    src={jobseeker.photoUrl}
                    alt={profileName}
                    width={80}
                    height={80}
                    className="rounded-full object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-purple flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      {initials}
                    </span>
                  </div>
                )}
              </div>
              {profileCompletionPercentage !== undefined && (
                <Typography
                  variant="body-small"
                  className="absolute -bottom-5 left-1/2 -translate-x-1/2 font-semibold text-xs text-purple whitespace-nowrap"
                >
                  {profileCompletionPercentage}% Completed
                </Typography>
              )}
            </>
          ) : (
            // Standard version with border circles
            <div className="absolute inset-0 rounded-full border-[2px] border-[#37E7B6] p-1.5">
              <div className="w-full h-full rounded-full border-[3px] border-[#F5EBFF] flex items-center justify-center bg-gradient-to-br from-purple/10 to-purple/5 overflow-hidden">
                {jobseeker.photoUrl ? (
                  <Image
                    src={jobseeker.photoUrl}
                    alt={profileName}
                    width={80}
                    height={80}
                    className="rounded-full object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-purple flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      {initials}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Name and Title */}
        <div className="flex-1 min-w-0 pt-1">
          <Typography
            variant="h2"
            className="text-dark-blue font-semibold text-lg mb-1"
          >
            {profileName}
          </Typography>
          {professionalTitle && (
            <Typography
              variant="body-small"
              className="text-dark-blue font-medium text-xs mb-1"
            >
              {professionalTitle}
            </Typography>
          )}
          {currentCompany && (
            <Typography variant="body-small" className="text-grey-blue text-xs">
              At {currentCompany}
            </Typography>
          )}
        </div>

        {/* Edit Button for Current User - Top Right */}
        {isCurrentUser && (
          <Button
            onClick={handleEdit}
            className="text-purple hover:bg-purple/10"
            variant="ghost"
            size="sm"
            icon={<Edit className="w-4 h-4" />}
            iconPosition="center"
          />
        )}
      </div>

      {/* Profile Details - Compact Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {jobType && (
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-grey-blue flex-shrink-0" />
            <Typography
              variant="body-small"
              className="text-dark-blue text-xs font-medium truncate"
            >
              {jobType}
            </Typography>
          </div>
        )}
        {(jobseeker.contactPhone || !isCurrentUser) && (
          <div className="flex items-center gap-1.5 min-w-0">
            <Phone className="w-4 h-4 text-grey-blue flex-shrink-0" />
            <Typography
              variant="body-small"
              className="text-dark-blue text-xs truncate"
            >
              {jobseeker.contactPhone || "Not specified"}
            </Typography>
          </div>
        )}

        {experienceDisplay && (
          <div className="flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-dark-blue flex-shrink-0" />
            <Typography
              variant="body-small"
              className="text-dark-blue text-xs font-medium truncate"
            >
              {experienceDisplay}
            </Typography>
          </div>
        )}

        {(jobseeker.contactEmail || !isCurrentUser) && (
          <div className="flex items-center gap-1.5 min-w-0">
            <Mail className="w-4 h-4 text-grey-blue flex-shrink-0" />
            <Typography
              variant="body-small"
              className="text-dark-blue text-xs truncate"
            >
              {jobseeker.contactEmail || "Not specified"}
            </Typography>
          </div>
        )}

        {(salaryMin > 0 || salaryMax > 0) && (
          <div className="flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-dark-blue flex-shrink-0" />
            <div className="flex items-center gap-0.5 min-w-0">
              <span className="text-[10px]">{ctcCurrency}</span>
              <Typography
                variant="body-small"
                className="text-dark-blue text-xs font-medium truncate"
              >
                {salaryMin.toLocaleString()}
              </Typography>
              {salaryMax > salaryMin && (
                <>
                  <span className="text-dark-blue text-xs">-</span>
                  <span className="text-[10px]">{ctcCurrency}</span>
                  <Typography
                    variant="body-small"
                    className="text-dark-blue text-xs font-medium truncate"
                  >
                    {salaryMax.toLocaleString()}
                  </Typography>
                </>
              )}
            </div>
          </div>
        )}

        {availability && (
          <div className="flex items-center gap-1.5">
            <Rocket className="w-4 h-4 text-dark-blue flex-shrink-0" />
            <Typography
              variant="body-small"
              className="text-dark-blue text-xs font-medium truncate"
            >
              {availability}
            </Typography>
          </div>
        )}
      </div>

      {/* Action Buttons - Full Width Stack */}
      {!isCurrentUser && (
        <div className="flex flex-col gap-2 pt-4 border-t border-gray-200">
          {type === "applicantsList" ? (
            // Applicants list view - show Shortlist, Reject, Chat with applicant
            <>
              <Button
                onClick={handleShortlist}
                isLoading={acceptApplicationMutation.isPending}
                disabled={
                  acceptApplicationMutation.isPending ||
                  !applicationId ||
                  !jobId ||
                  applicationStatus === "hired"
                }
                className="bg-success-100 text-white hover:bg-success-60 w-full"
                size="sm"
              >
                {applicationStatus === "hired" ? "Shortlisted" : "Shortlist"}
              </Button>
              <Button
                onClick={handleReject}
                isLoading={rejectApplicationMutation.isPending}
                disabled={
                  rejectApplicationMutation.isPending ||
                  !applicationId ||
                  !jobId ||
                  applicationStatus === "rejected"
                }
                variant="danger"
                className="bg-error-100 text-white hover:bg-error-60 w-full"
                size="sm"
              >
                {applicationStatus === "rejected" ? "Rejected" : "Reject"}
              </Button>
              <Button
                onClick={() => toast.info("Under development")}
                className="bg-purple text-white hover:bg-purple/90 w-full"
                size="sm"
              >
                {actions?.chatButtonText || "Chat With Applicant"}
              </Button>
            </>
          ) : type === "profileVisit" ? (
            // Profile visit view - show Connect, Message
            <>
              <Button
                onClick={() => {
                  handleConnection(connectionStatus, requestId);
                }}
                isLoading={
                  cancelConnectReq.isPending || sendConnectionReq.isPending
                }
                disabled={
                  cancelConnectReq.isPending || sendConnectionReq.isPending
                }
                className={
                  connectionStatus === "PENDING" ||
                  connectionStatus === "ACCEPTED"
                    ? "bg-white text-dark-blue border border-gray-300 hover:bg-gray-50 w-full"
                    : "bg-purple text-white hover:bg-purple/90 w-full"
                }
                size="sm"
                icon={<UserPlus className="w-4 h-4" />}
                iconPosition="left"
                variant={
                  connectionStatus === "PENDING" ||
                  connectionStatus === "ACCEPTED"
                    ? "outline"
                    : "primary"
                }
              >
                {connectionStatus === "ACCEPTED"
                  ? "Connected"
                  : connectionStatus === "PENDING"
                  ? "Cancel Request"
                  : connectionStatus === "REJECTED"
                  ? "Send Request"
                  : "Connect"}
              </Button>
              <Button
                onClick={() => toast.info("Under development")}
                variant="outline"
                className="bg-white text-dark-blue border border-gray-300 hover:bg-gray-50 w-full"
                size="sm"
                icon={<MessageCircle className="w-4 h-4" />}
                iconPosition="left"
              >
                Message
              </Button>
            </>
          ) : actions ? (
            // Default view - show all available interaction buttons if actions provided
            <>
              {actions.onChat && (
                <Button
                  onClick={actions.onChat}
                  className="bg-purple text-white hover:bg-purple/90 w-full"
                  size="sm"
                >
                  {actions.chatButtonText || "Chat With Jobseeker"}
                </Button>
              )}

              {actions.onReport && (
                <Button
                  onClick={actions.onReport}
                  variant="outline"
                  className="bg-white text-dark-blue border border-gray-300 hover:bg-gray-50 w-full"
                  size="sm"
                >
                  Report
                </Button>
              )}
              {actions.onBlock && (
                <Button
                  onClick={actions.onBlock}
                  variant="outline"
                  className="bg-white text-dark-blue border border-gray-300 hover:bg-gray-50 w-full"
                  size="sm"
                  icon={<Ban className="w-4 h-4" />}
                  iconPosition="left"
                >
                  Block User
                </Button>
              )}
            </>
          ) : null}
        </div>
      )}

      {/* Edit Button for Current User - Bottom */}
      {isCurrentUser && (
        <div className="flex flex-col gap-2 pt-4 border-t border-gray-200">
          <Button
            onClick={handleEdit}
            className="text-purple hover:bg-purple/10 w-full"
            variant="outline"
            size="sm"
            icon={<Edit className="w-4 h-4" />}
            iconPosition="left"
          >
            Edit Your Profile
          </Button>
        </div>
      )}

      {/* Last Updated - Bottom */}
      {lastUpdated && (
        <Typography
          variant="body-small"
          className="text-grey-blue text-xs font-poppins mt-3 pt-3 border-t border-gray-100 text-center"
        >
          Profile last updated - {lastUpdated}
        </Typography>
      )}
    </div>
  );
}
