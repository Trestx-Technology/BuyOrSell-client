import { axiosInstance as apiClient } from "@/services/axios-api-client";
import { CreateReportDto, UpdateReportDto, ReportUser } from "@/interfaces/report-user.types";
import { reportUserQueries } from "./index";

export const createReportUser = async (payload: CreateReportDto): Promise<{ data: ReportUser }> => {
  const response = await apiClient.post<{ data: ReportUser }>(reportUserQueries.create.endpoint, payload);
  return response.data;
};

export const getAllReportUsers = async (): Promise<{ data: ReportUser[] }> => {
  const response = await apiClient.get<{ data: ReportUser[] }>(reportUserQueries.all.endpoint);
  return response.data;
};

export const getReportUserById = async (id: string): Promise<{ data: ReportUser }> => {
  const response = await apiClient.get<{ data: ReportUser }>(reportUserQueries.byId(id).endpoint);
  return response.data;
};

export const updateReportUser = async ({ id, payload }: { id: string; payload: UpdateReportDto }): Promise<{ data: ReportUser }> => {
  const response = await apiClient.put<{ data: ReportUser }>(reportUserQueries.update(id).endpoint, payload);
  return response.data;
};

export const deleteReportUser = async (id: string): Promise<void> => {
  await apiClient.delete(reportUserQueries.delete(id).endpoint);
};

export const getReportsByUserId = async (userId: string): Promise<{ data: ReportUser[] }> => {
  const response = await apiClient.get<{ data: ReportUser[] }>(reportUserQueries.byUserId(userId).endpoint);
  return response.data;
};
