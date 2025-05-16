export interface Item {
  id: string;
  name: string;
  done: boolean;
}

export interface Group {
  id: string;
  name: string;
  items: Item[];
  collapsed: boolean;
}

export interface List {
  id: string;
  name: string;
  groups: Group[];
}
