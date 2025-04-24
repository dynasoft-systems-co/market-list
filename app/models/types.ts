export type Item = {
  id: string;
  name: string;
  checked: boolean;
  order: number;
};

export type Group = {
  id: string;
  name: string;
  items: Item[];
  order: number;
};
