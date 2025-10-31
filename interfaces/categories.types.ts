export interface Field {
  name: string;
  type:
    | "searchableDropdown"
    | "dropdown"
    | "selectableTabs"
    | "bool"
    | "int"
    | "number"
    | "string"
    | "file"
    | "location"
    | "[]string"
    | "[]number"
    | "text"
    | "checkboxes"
    | "image"
    | "selection"
    | "textArea"
    | "radio"
    | "date"
    | "time"
    | "datetime"
    | "color"
    | "testArea";
  value?: string;
  default?: string;
  defaultValue?: string | number | string[] | undefined;
  optionalArray?: string[];
  optionalMapOfArray?: Record<string, string[]>;
  isOptional?: boolean;
  secureInput?: boolean;
  isSecure?: boolean;
  requires?: boolean;
  required?: boolean;
  dependsOn?: string;
  singleImage?: boolean;
  hidden?: boolean;
  min?: number;
  max?: number;
  colorMap?: Record<string, string>;
  excludeFor?: string[];
  relatedTo?: string;
  searchable?: boolean;
  filter?: string;
  section?: string;
  sequence?: number;
  sectionSequence?: number;
  icon?: string;
}

export interface ParentCategory {
  _id: string;
  name: string;
  nameAr?: string;
  desc: string;
  descAr?: string;
  icon: string;
  banner: string;
  image: string;
  fields: Field[];
  childIDs: string[];
  bgColor: string;
  mobileImage: string;
  children: SubCategory[];
  relatedTo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubCategory {
  parentID?: string | null; // Optional for main categories
  _id: string;
  name: string;
  nameAr?: string;
  desc: string;
  descAr?: string;
  icon?: string;
  banner?: string;
  image?: string;
  fields: Field[];
  childIDs: string[];
  bgColor?: string;
  mobileImage?: string;
  relatedTo?: string;
  children: SubCategory[];
  brands?: unknown[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoriesApiResponse {
  statusCode: number;
  timestamp: string;
  data: SubCategory[]
}
export interface CategoriesTreeApiResponse {
  statusCode: number;
  timestamp: string;
  data: {
    categories: SubCategory[];
    total: number;
  };
}

// Response from /categories/tree/:id - returns a single category with nested children
export type CategoryTreeResponse = SubCategory;