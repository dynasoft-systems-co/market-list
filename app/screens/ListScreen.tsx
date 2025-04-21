import React, { useState } from 'react';
import { FlatList } from 'react-native';
import { Group } from '../models/types';
import { Container } from '../styles/global';
import GroupSection from '../components/GroupSection';

const mockGroups: Group[] = [
  {
    id: '1',
    name: 'Produce',
    order: 0,
    items: [
      { id: '1-1', name: 'Apples', checked: false },
      { id: '1-2', name: 'Bananas', checked: true },
    ],
  },
  {
    id: '2',
    name: 'Dairy',
    order: 1,
    items: [
      { id: '2-1', name: 'Milk', checked: false },
      { id: '2-2', name: 'Cheese', checked: false },
    ],
  },
];

const ListScreen = () => {
  const [groups, setGroups] = useState<Group[]>(mockGroups);

  return (
    <Container>
      <FlatList
        data={groups}
        keyExtractor={(group) => group.id}
        renderItem={({ item }) => (
          <GroupSection group={item} />
        )}
      />
    </Container>
  );
};

export default ListScreen;
