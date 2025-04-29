import React from 'react';
import { View } from 'react-native';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import styled from 'styled-components/native';
import { Group, Item } from '../models/types';
import AddGroupButton from '../components/AddGroupButton';
import ItemList from '../components/ItemList';
import uuid from 'react-native-uuid';
import { MaterialIcons } from '@expo/vector-icons';

type Props = {
  groups: Group[];
  setGroups: React.Dispatch<React.SetStateAction<Group[]>>;
  onAddItem: (groupId: string, itemName: string) => void;
  onRemoveItem: (groupId: string, itemId: string) => void;
  onRemoveGroup: (groupId: string) => void;
  onMoveItem: (groupId: string, itemId: string, direction: 'up' | 'down') => void;
};

const Container = styled.View`
  flex: 1;
  background-color: #f4f4f4;
`;

const GroupContainer = styled.View`
  margin: 10px 0;
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  elevation: 2;
`;

const GroupHeader = styled.View`
  padding: 12px 16px;
  background-color: #7216f4;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const DragHandle = styled.TouchableOpacity`
  padding: 4px;
`;

const GroupTitle = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  flex: 1;
`;


const ListScreen = ({
  groups,
  setGroups,
  onAddItem,
  onRemoveItem,
  onRemoveGroup,
  onMoveItem,
}: Props) => {
  const handleReorderGroups = (data: Group[]) => {
    setGroups(data);
  };

  const handleReorderItems = (newItems: Item[], groupId: string) => {
    setGroups(prev =>
      prev.map(g => (g.id === groupId ? { ...g, items: newItems } : g))
    );
  };

  const renderGroup = ({ item, drag }: RenderItemParams<Group>) => (
    <GroupContainer>
      <GroupHeader>
        <GroupTitle>{item.name}</GroupTitle>
        <DragHandle onPressIn={drag}>
          <MaterialIcons name="drag-handle" size={20} color="#fff" />
        </DragHandle>
      </GroupHeader>


      <ItemList
        items={item.items}
        groupId={item.id}
        onReorder={(newItems) => handleReorderItems(newItems, item.id)}
      />
    </GroupContainer>
  );

  const handleAddGroup = () => {
    const newGroup: Group = {
      id: uuid.v4() as string,
      name: `Group ${groups.length + 1}`,
      items: [],
    };
    setGroups(prev => [...prev, newGroup]);
  };

  return (
    <Container>
      <DraggableFlatList
        data={groups}
        keyExtractor={(item) => item.id}
        renderItem={renderGroup}
        onDragEnd={({ data }) => handleReorderGroups(data)}
      />

      <AddGroupButton onPress={handleAddGroup} />
    </Container>
  );
};

export default ListScreen;
