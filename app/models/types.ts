export type Item = {
  id: string;
  name: string;
  checked: boolean;
};

export type Group = {
  id: string;
  name: string;
  items: Item[];
  order: number;
};
