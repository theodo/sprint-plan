export type NotionDatabase = {
  id: string;
  name: string;
  properties: NotionProperty[];
};

export type NotionProperty = {
  name: string;
  type: SupportedTypes;
  possibleValues: string[];
};

export type SupportedTypes = "select" | "multi_select";

export type Filter = {
  property: string;
  values: string[];
};
