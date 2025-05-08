import React, { useState } from 'react';
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
  parentGestureHandlerRef: React.RefObject<any>; // <-- NOVA PROP
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

const GroupInput = styled.TextInput`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  border-bottom-width: 1px;
  border-color: #fff;
  margin-right: 8px;
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
  parentGestureHandlerRef, // <- USADA AQUI
}: Props) => {
  const handleReorderGroups = (data: Group[]) => {
    setGroups(data);
  };

  const handleRenameItem = (groupId: string, itemId: string, newName: string) => {
    setGroups(prev =>
      prev.map(group =>
        group.id === groupId
          ? {
              ...group,
              items: group.items.map(item =>
                item.id === itemId ? { ...item, name: newName } : item
              ),
            }
          : group
      )
    );
  };

  const handleReorderItems = (newItems: Item[], groupId: string) => {
    setGroups(prev =>
      prev.map(g => (g.id === groupId ? { ...g, items: newItems } : g))
    );
  };

  const renderGroup = ({ item, drag }: RenderItemParams<Group>) => {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(item.name);

    const handleSubmit = () => {
      setGroups(prev =>
        prev.map(g => (g.id === item.id ? { ...g, name } : g))
      );
      setIsEditing(false);
    };

    return (
      <GroupContainer>
        <GroupHeader>
          {isEditing ? (
            <GroupInput
              value={name}
              onChangeText={setName}
              onSubmitEditing={handleSubmit}
              onBlur={handleSubmit}
              autoFocus
            />
          ) : (
            <GroupTitle onPress={() => setIsEditing(true)}>{item.name}</GroupTitle>
          )}
          <DragHandle onPressIn={drag}>
            <MaterialIcons name="drag-handle" size={20} color="#fff" />
          </DragHandle>
        </GroupHeader>

        <ItemList
          items={item.items}
          groupId={item.id}
          onReorder={(newItems) => handleReorderItems(newItems, item.id)}
          onRenameItem={(itemId, newName) => handleRenameItem(item.id, itemId, newName)}
          onRemoveItem={onRemoveItem}
          onAddItem={onAddItem}
          simultaneousHandlers={parentGestureHandlerRef} // <- AQUI PASSAMOS A REF
        />
      </GroupContainer>
    );
  };

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
