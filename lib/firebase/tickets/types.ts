import { Timestamp } from "firebase/firestore";

export type TicketStatus =
  | "open"
  | "in_progress"
  | "waiting_for_user"
  | "resolved"
  | "closed";
export type QueryType =
  | "technical"
  | "billing"
  | "account"
  | "feature_request"
  | "bug_report"
  | "other";
export type Priority = "low" | "medium" | "high" | "urgent";

export interface TicketMetadata {
  userAgent?: string;
  platform?: string;
  appVersion?: string;
}

export interface Ticket {
  id: string;
  userId: string;
  subject: string;
  message: string;
  queryType: QueryType;
  status: TicketStatus;
  priority?: Priority;
  assignedTo?: string; // Support staff ID
  chatId: string; // Reference to chat conversation
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
  resolvedAt?: Timestamp | Date;
  closedAt?: Timestamp | Date;
  resolutionNote?: string;
  tags?: string[];
  metadata?: TicketMetadata;
}

export interface CreateTicketParams {
  userId: string;
  subject: string;
  message: string;
  queryType: QueryType;
  priority?: Priority;
  metadata?: TicketMetadata;
}

export interface TicketFilters {
  status?: TicketStatus[];
  queryType?: QueryType[];
  sortBy?: "createdAt" | "updatedAt";
  order?: "asc" | "desc";
}
