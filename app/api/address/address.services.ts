import { axiosInstance } from "@/services/axios-api-client";
import { addressQueries } from "./index";
import type {
  CreateAddressPayload,
  UpdateAddressPayload,
  AddressResponse,
  AddressesListResponse,
  DeleteAddressResponse,
} from "@/interfaces/address.types";

// Create a new address
export const createAddress = async (
  data: CreateAddressPayload
): Promise<AddressResponse> => {
  const response = await axiosInstance.post<AddressResponse>(
    addressQueries.createAddress.endpoint,
    data
  );
  return response.data;
};

// Get all addresses for the current user
export const getMyAddresses = async (): Promise<AddressesListResponse> => {
  const response = await axiosInstance.get<AddressesListResponse>(
    addressQueries.getMyAddresses.endpoint
  );
  return response.data;
};

// Get address by ID
export const getAddressById = async (id: string): Promise<AddressResponse> => {
  const response = await axiosInstance.get<AddressResponse>(
    addressQueries.getAddressById(id).endpoint
  );
  return response.data;
};

// Update an address
export const updateAddress = async (
  id: string,
  data: UpdateAddressPayload
): Promise<AddressResponse> => {
  const response = await axiosInstance.put<AddressResponse>(
    addressQueries.updateAddress(id).endpoint,
    data
  );
  return response.data;
};

// Delete an address
export const deleteAddress = async (
  id: string
): Promise<DeleteAddressResponse> => {
  const response = await axiosInstance.delete<DeleteAddressResponse>(
    addressQueries.deleteAddress(id).endpoint
  );
  return response.data;
};
