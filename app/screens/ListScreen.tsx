import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import { Swipeable, PanGestureHandler } from 'react-native-gesture-handler';
import styled from 'styled-components/native';
import { Group, Item } from '../models/types';
import { loadGroups, saveGroups } from '../storage/useShoppingListStorage';
import AddGroupButton from '../components/AddGroupButton';
import ItemList from '../components/ItemList';
import uuid from 'react-native-uuid';
import { MaterialIcons } from '@expo/vector-icons';

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

const GroupTitle = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  flex: 1;
`;

const DragHandle = styled.TouchableOpacity`
  padding: 4px;
`;

const ListScreen = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const gestureRef = useRef(null);

  useEffect(() => {
    (async () => {
      const saved = await loadGroups();
      setGroups(saved);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!loading) {
      saveGroups(groups);
    }
  }, [groups]);

  const handleAddGroup = () => {
    const newGroup: Group = {
      id: uuid.v4() as string,
      name: `Group ${groups.length + 1}`,
      items: [],
    };
    setGroups(prev => [...prev, newGroup]);
  };

  const handleAddItem = (groupId: string, itemName: string) => {
    setGroups(prev =>
      prev.map(g =>
        g.id === groupId
          ? {
              ...g,
              items: [
                ...g.items,
                { id: uuid.v4() as string, name: itemName, done: false },
              ],
            }
          : g
      )
    );
  };

  const handleRemoveItem = (groupId: string, itemId: string) => {
    setGroups(prev =>
      prev.map(g =>
        g.id === groupId
          ? { ...g, items: g.items.filter(i => i.id !== itemId) }
          : g
      )
    );
  };

  const handleRemoveGroup = (groupId: string) => {
    setGroups(prev => prev.filter(g => g.id !== groupId));
  };

  const handleMoveItem = (groupId: string, itemId: string, direction: 'up' | 'down') => {
    setGroups(prev =>
      prev.map(g => {
        if (g.id !== groupId) return g;
        const index = g.items.findIndex(i => i.id === itemId);
        if (index === -1) return g;

        const newItems = [...g.items];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= newItems.length) return g;

        [newItems[index], newItems[targetIndex]] = [
          newItems[targetIndex],
          newItems[index],
        ];

        return { ...g, items: newItems };
      })
    );
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

  const handleReorderGroups = (data: Group[]) => {
    setGroups(data);
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

    const renderRightActions = () => (
      <TouchableOpacity
        style={{
          backgroundColor: 'red',
          justifyContent: 'center',
          alignItems: 'center',
          width: 80,
          height: '100%',
        }}
        onPress={() => handleRemoveGroup(item.id)}
      >
        <MaterialIcons name="delete" size={24} color="#fff" />
      </TouchableOpacity>
    );

    return (
      <Swipeable renderRightActions={renderRightActions}>
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
            onRemoveItem={handleRemoveItem}
            onAddItem={handleAddItem}
            parentGestureHandlerRef={gestureRef}
          />
        </GroupContainer>
      </Swipeable>
    );
  };

  if (loading) {
    return (
      <View style={{ padding: 20 }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <PanGestureHandler ref={gestureRef}>
      <Container>
        <DraggableFlatList
          data={groups}
          keyExtractor={(item) => item.id}
          renderItem={renderGroup}
          onDragEnd={({ data }) => handleReorderGroups(data)}
        />

        <AddGroupButton onPress={handleAddGroup} />
      </Container>
    </PanGestureHandler>
  );
};

export default ListScreen;
