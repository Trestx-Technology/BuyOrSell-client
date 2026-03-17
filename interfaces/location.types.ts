export interface Emirate {
  emirate: string;
  emirateAr: string;
}

export interface LocationApiResponse {
  statusCode: number;
  timestamp: string;
  data: Emirate[] | string[];
}

export interface AreasApiResponse {
  statusCode: number;
  timestamp: string;
  data: string[];
}

export interface CitiesApiResponse {
  statusCode: number;
  timestamp: string;
  data: string[];
}

export interface Country {
  country: string;
  countryAr: string;
}

export interface CountriesApiResponse {
  statusCode: number;
  timestamp: string;
  data: Country[] | string[];
}
