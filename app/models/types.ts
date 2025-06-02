export type ListType = "group" | "list";

export interface Item {
  id: string;
  name: string;
  done: boolean;
  order: number;
}

export interface Group {
  id: string;
  name: string;
  items: Item[];
  collapsed: boolean;
  order: number;
}

export interface List {
  id: string;
  name: string;
  groups: Group[];
  type: ListType;
}
