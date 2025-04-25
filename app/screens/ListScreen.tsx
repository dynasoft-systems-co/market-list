import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Group } from '../models/types';
import GroupSection from '../components/GroupSection';
import uuid from 'react-native-uuid';
import AddGroupButton from '../components/AddGroupButton';

type Props = {
  groups: Group[];
  setGroups: React.Dispatch<React.SetStateAction<Group[]>>;
  onAddItem: (groupId: string, itemName: string) => void;
  onRemoveItem: (groupId: string, itemId: string) => void;
  onRemoveGroup: (groupId: string) => void;
  onMoveItem: (
    groupId: string,
    itemId: string,
    direction: 'up' | 'down'
  ) => void;
};

const ListScreen = ({
  groups,
  setGroups,
  onAddItem,
  onRemoveItem,
  onRemoveGroup,
  onMoveItem,
}: Props) => {
  const handleAddGroup = () => {
    const newGroup: Group = {
      id: uuid.v4() as string,
      name: `Group ${groups.length + 1}`,
      items: [],
    };
    setGroups(prev => [...prev, newGroup]);
  };

  return (
    <View style={styles.container}>
      <AddGroupButton onPress={handleAddGroup} />
      {groups.length === 0 ? (
        <Text style={styles.emptyText}>No groups yet. Add one above!</Text>
      ) : (
        <FlatList
          data={groups}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <GroupSection
              group={item}
              onAddItem={onAddItem}
              onRemoveItem={onRemoveItem}
              onRemoveGroup={onRemoveGroup}
              onMoveItem={onMoveItem}
            />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  emptyText: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ListScreen;
