import React, { useState, useEffect } from 'react';
import { FlatList, Text, ActivityIndicator } from 'react-native';
import DraggableFlatList, {
  RenderItemParams,
} from 'react-native-draggable-flatlist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Group } from '../models/types';
import { Container, CenteredContent } from '../styles/global';
import GroupSection from '../components/GroupSection';
import AddGroupButton from '../components/AddGroupButton';
import uuid from 'react-native-uuid';

const STORAGE_KEY = '@market_list_groups';

const ListScreen = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadGroups = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          setGroups(JSON.parse(saved));
        }
      } catch (error) {
        console.error('Failed to load groups from storage:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadGroups();
  }, []);

  useEffect(() => {
    const saveGroups = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(groups));
      } catch (error) {
        console.error('Failed to save groups to storage:', error);
      }
    };
    if (!isLoading) {
      saveGroups();
    }
  }, [groups]);

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
    setGroups((prevGroups) =>
      prevGroups.map((g) =>
        g.id === groupId
          ? { ...g, items: g.items.filter((item) => item.id !== itemId) }
          : g
      )
    );
  };

  const moveGroup = (groupId: string, direction: 'up' | 'down') => {
    setGroups((prevGroups) => {
      const index = prevGroups.findIndex((g) => g.id === groupId);
      if (index < 0) return prevGroups;
  
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prevGroups.length) return prevGroups;
  
      const newGroups = [...prevGroups];
      [newGroups[index], newGroups[targetIndex]] = [newGroups[targetIndex], newGroups[index]];
  
      // Update order fields
      return newGroups.map((g, i) => ({ ...g, order: i }));
    });
  };

  const moveItem = (groupId: string, itemId: string, direction: 'up' | 'down') => {
    setGroups((prevGroups) =>
      prevGroups.map((g) => {
        if (g.id !== groupId) return g;
  
        const index = g.items.findIndex((i) => i.id === itemId);
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (index < 0 || targetIndex < 0 || targetIndex >= g.items.length) return g;
  
        const newItems = [...g.items];
        [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
  
        return {
          ...g,
          items: newItems.map((i, iIndex) => ({ ...i, order: iIndex })),
        };
      })
    );
  };

  if (isLoading) {
    return (
      <CenteredContent>
        <ActivityIndicator size="large" color="#7216f4" />
        <Text style={{ marginTop: 10 }}>Loading...</Text>
      </CenteredContent>
    );
  }

  return (
    <Container>
      <FlatList
        data={[...groups].sort((a, b) => a.order - b.order)}
        keyExtractor={(group) => group.id}
        renderItem={({ item }) => (
          <GroupSection
            group={item}
            onAddItem={handleAddItem}
            onRemoveItem={handleRemoveItem}
            onRemoveGroup={handleRemoveGroup}
            onMoveGroup={moveGroup}
            onMoveItem={moveItem}
          />
        )}
        ListFooterComponent={<AddGroupButton onPress={handleAddGroup} />}
      />
    </Container>
  );
};

export default ListScreen;
