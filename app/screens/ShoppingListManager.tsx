import React, { useEffect, useRef, useState } from 'react';
import { View, Text } from 'react-native';
import ListScreen from './ListScreen';
import { Group, Item } from '../models/types';
import { loadGroups, saveGroups } from '../storage/useShoppingListStorage';
import uuid from 'react-native-uuid';
import { PanGestureHandler } from 'react-native-gesture-handler';

const ShoppingListManager = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  const gestureRef = useRef(null); // <-- REF PARA GESTOS

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

  const handleMoveItem = (
    groupId: string,
    itemId: string,
    direction: 'up' | 'down'
  ) => {
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

  if (loading) {
    return (
      <View style={{ padding: 20 }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <PanGestureHandler ref={gestureRef}>
      <View style={{ flex: 1 }}>
        <ListScreen
          groups={groups}
          setGroups={setGroups}
          onAddItem={handleAddItem}
          onRemoveItem={handleRemoveItem}
          onRemoveGroup={handleRemoveGroup}
          onMoveItem={handleMoveItem}
          parentGestureHandlerRef={gestureRef} // <- PROP PARA LISTSCREEN
        />
      </View>
    </PanGestureHandler>
  );
};

export default ShoppingListManager;
