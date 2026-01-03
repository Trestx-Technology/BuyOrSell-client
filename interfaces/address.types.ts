export interface CreateAddressPayload {
  userID: string;
  emirate: string;
  street: string;
  country: string;
  zipCode: string;
  city: string;
  address: string;
  addressType: "primary" | "secondary";
  area: string;
  type: "home" | "work";
}

export interface UpdateAddressPayload {
  emirate?: string;
  street?: string;
  country?: string;
  zipCode?: string;
  city?: string;
  address?: string;
  addressType?: "primary" | "secondary";
  area?: string;
  type?: "home" | "work";
}

export interface Address {
  _id: string;
  userID: string;
  emirate: string;
  emirateAr?: string;
  country: string;
  countryAr?: string;
  zipCode: string;
  city: string;
  cityAr?: string;
  street: string;
  address: string;
  addressAr?: string;
  area: string;
  areaAr?: string;
  addressType: "primary" | "secondary";
  type?: "home" | "work";
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface AddressResponse {
  statusCode: number;
  timestamp: string;
  message?: string;
  data: Address;
}

export interface AddressesListResponse {
  statusCode: number;
  timestamp: string;
  message?: string;
  data: Address[];
}

export interface DeleteAddressResponse {
  statusCode: number;
  timestamp: string;
  message?: string;
}
