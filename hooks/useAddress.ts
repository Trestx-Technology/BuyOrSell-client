import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createAddress,
  getMyAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
} from "@/app/api/address/address.services";
import type {
  CreateAddressPayload,
  UpdateAddressPayload,
  AddressResponse,
  AddressesListResponse,
  DeleteAddressResponse,
} from "@/interfaces/address.types";
import { addressQueries } from "@/app/api/address/index";

// ============================================================================
// QUERY HOOKS
// ============================================================================

export const useGetMyAddresses = (enabled: boolean = true) => {
  return useQuery<AddressesListResponse, Error>({
    queryKey: [...addressQueries.getMyAddresses.Key],
    queryFn: () => getMyAddresses(),
    enabled,
  });
};

export const useGetAddressById = (id: string, enabled: boolean = true) => {
  return useQuery<AddressResponse, Error>({
    queryKey: [...addressQueries.getAddressById(id).Key],
    queryFn: () => getAddressById(id),
    enabled: enabled && !!id,
  });
};

// ============================================================================
// MUTATION HOOKS
// ============================================================================

export const useCreateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation<AddressResponse, Error, CreateAddressPayload>({
    mutationFn: createAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...addressQueries.getMyAddresses.Key],
      });
    },
  });
};

export const useUpdateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation<
    AddressResponse,
    Error,
    { id: string; data: UpdateAddressPayload }
  >({
    mutationFn: ({ id, data }) => updateAddress(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...addressQueries.getMyAddresses.Key],
      });
    },
  });
};

export const useDeleteAddress = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteAddressResponse, Error, string>({
    mutationFn: deleteAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...addressQueries.getMyAddresses.Key],
      });
    },
  });
};
