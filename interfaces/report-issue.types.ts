export interface CreateReportIssueDto {
  title?: string;
  description?: string;
  type?: string;
  images?: string[];
  [key: string]: any;
}

export interface UpdateReportIssueDto extends Partial<CreateReportIssueDto> {}

export interface ReportIssue {
  _id: string;
  title?: string;
  description?: string;
  type?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}
