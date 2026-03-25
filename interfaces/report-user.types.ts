export type ReportedType = "user" | "ad" | "company" | "organization";

export interface CreateReportDto {
  reported: string;
  reportedType: ReportedType;
  reportedBy: string;
  reportReason?: string;
}

export interface UpdateReportDto {
  reported?: string;
  reportedType?: ReportedType;
  reportedBy?: string;
  reportReason?: string;
}

export interface ReportUser {
  _id: string;
  reported: string;
  reportedType: ReportedType;
  reportedBy: string;
  reportReason?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}
