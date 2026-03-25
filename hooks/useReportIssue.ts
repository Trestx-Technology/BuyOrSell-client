import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createReportIssue,
  getAllReportIssues,
  getReportIssueById,
  updateReportIssue,
  deleteReportIssue,
} from "@/app/api/report-issue/report-issue.services";
import { reportIssueQueries } from "@/app/api/report-issue";

export const useReportIssues = () => {
  return useQuery({
    queryKey: reportIssueQueries.all.Key,
    queryFn: getAllReportIssues,
  });
};

export const useReportIssueById = (issueId: string) => {
  return useQuery({
    queryKey: reportIssueQueries.byId(issueId).Key,
    queryFn: () => getReportIssueById(issueId),
    enabled: !!issueId,
  });
};

export const useCreateReportIssue = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createReportIssue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reportIssueQueries.all.Key });
    },
  });
};

export const useUpdateReportIssue = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateReportIssue,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: reportIssueQueries.byId(variables.issueId).Key });
      queryClient.invalidateQueries({ queryKey: reportIssueQueries.all.Key });
    },
  });
};

export const useDeleteReportIssue = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteReportIssue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reportIssueQueries.all.Key });
    },
  });
};

