import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createReportUser,
  getAllReportUsers,
  getReportUserById,
  updateReportUser,
  deleteReportUser,
  getReportsByUserId,
} from "@/app/api/report-user/report-user.services";
import { reportUserQueries } from "@/app/api/report-user";

export const useReportUsers = () => {
  return useQuery({
    queryKey: reportUserQueries.all.Key,
    queryFn: getAllReportUsers,
  });
};

export const useReportUserById = (id: string) => {
  return useQuery({
    queryKey: reportUserQueries.byId(id).Key,
    queryFn: () => getReportUserById(id),
    enabled: !!id,
  });
};

export const useReportUsersByUserId = (userId: string) => {
  return useQuery({
    queryKey: reportUserQueries.byUserId(userId).Key,
    queryFn: () => getReportsByUserId(userId),
    enabled: !!userId,
  });
};

export const useCreateReportUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createReportUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reportUserQueries.all.Key });
    },
  });
};

export const useUpdateReportUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateReportUser,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: reportUserQueries.byId(variables.id).Key });
      queryClient.invalidateQueries({ queryKey: reportUserQueries.all.Key });
    },
  });
};

export const useDeleteReportUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteReportUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reportUserQueries.all.Key });
    },
  });
};


