export type ListType = "group" | "list";

export interface Item {
  id: string;
  name: string;
  done: boolean;
  order: number;
}

export interface List {
  id: string;
  name: string;
  items: Item[];
}

export interface OrderableList extends List {
  collapsed: boolean;
  order: number;
}

export interface GroupList {
  id: string;
  name: string;
  groups: OrderableList[];
}
