export type ComponentType = {
  Name: string;
  Categories: string[];
};

export type LibraryDataType = {
  Components: ComponentType[];
  Categories: string[];
};

export const CATEGORY_ALL = "All";
export const CATEGORY_ALL_RESULTS = "All results";
