import { axiosInstance as apiClient } from "@/services/axios-api-client";
import { CreateReportIssueDto, UpdateReportIssueDto, ReportIssue } from "@/interfaces/report-issue.types";
import { reportIssueQueries } from "./index";

export const createReportIssue = async (payload: CreateReportIssueDto): Promise<{ data: ReportIssue }> => {
  const response = await apiClient.post<{ data: ReportIssue }>(reportIssueQueries.create.endpoint, payload);
  return response.data;
};

export const getAllReportIssues = async (): Promise<{ data: ReportIssue[] }> => {
  const response = await apiClient.get<{ data: ReportIssue[] }>(reportIssueQueries.all.endpoint);
  return response.data;
};

export const getReportIssueById = async (issueId: string): Promise<{ data: ReportIssue }> => {
  const response = await apiClient.get<{ data: ReportIssue }>(reportIssueQueries.byId(issueId).endpoint);
  return response.data;
};

export const updateReportIssue = async ({ issueId, payload }: { issueId: string; payload: UpdateReportIssueDto }): Promise<{ data: ReportIssue }> => {
  const response = await apiClient.put<{ data: ReportIssue }>(reportIssueQueries.update(issueId).endpoint, payload);
  return response.data;
};

export const deleteReportIssue = async (issueId: string): Promise<void> => {
  await apiClient.delete(reportIssueQueries.delete(issueId).endpoint);
};
