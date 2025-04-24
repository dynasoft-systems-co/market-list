import React, { useState } from "react";
import { FlatList } from "react-native";
import { Group } from "../models/types";
import { Container } from "../styles/global";
import GroupSection from "../components/GroupSection";
import AddGroupButton from "../components/AddGroupButton";
import uuid from 'react-native-uuid';

const mockGroups: Group[] = [
  {
    id: "1",
    name: "Produce",
    order: 0,
    items: [
      { id: "1-1", name: "Apples", checked: false },
      { id: "1-2", name: "Bananas", checked: true },
    ],
  },
  {
    id: "2",
    name: "Dairy",
    order: 1,
    items: [
      { id: "2-1", name: "Milk", checked: false },
      { id: "2-2", name: "Cheese", checked: false },
    ],
  },
];

const ListScreen = () => {
  const [groups, setGroups] = useState<Group[]>([]);

  const handleAddGroup = () => {
    const newGroup: Group = {
      id: uuid.v4() as string,
      name: `New Section`,
      order: groups.length,
      items: [],
    };
    setGroups((prev) => [...prev, newGroup]);
  };

  const handleRemoveGroup = (groupId: string) => {
    setGroups((prev) => prev.filter((g) => g.id !== groupId));
  };

  const handleAddItem = (groupId: string, itemName: string) => {
    setGroups((prevGroups) =>
      prevGroups.map((g) =>
        g.id === groupId
          ? {
              ...g,
              items: [
                ...g.items,
                {
                  id: uuid.v4() as string,
                  name: itemName,
                  checked: false,
                },
              ],
            }
          : g
      )
    );
  };

  const handleRemoveItem = (groupId: string, itemId: string) => {
    setGroups((prevGroups) => prevGroups.map((g) => (g.id === groupId ? { ...g, items: g.items.filter((item) => item.id !== itemId) } : g)));
  };

  return (
    <Container>
      <FlatList data={groups} keyExtractor={(group) => group.id} renderItem={({ item }) => <GroupSection group={item} onAddItem={handleAddItem} onRemoveItem={handleRemoveItem} onRemoveGroup={handleRemoveGroup} />} ListFooterComponent={<AddGroupButton onPress={handleAddGroup} />} />
    </Container>
  );
};

export default ListScreen;
