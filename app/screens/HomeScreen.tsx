import React, { useState } from 'react';
import { View, FlatList, TextInput, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { Swipeable } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

type List = {
  id: string;
  name: string;
};

const HomeScreen = () => {
  const [lists, setLists] = useState<List[]>([
    { id: '1', name: 'Groceries' },
    { id: '2', name: 'Hardware Store' },
  ]);

  const navigation = useNavigation();

  const handleDeleteList = (id: string) => {
    setLists(prev => prev.filter(list => list.id !== id));
  };

  const handleRenameList = (id: string, newName: string) => {
    setLists(prev =>
      prev.map(list => (list.id === id ? { ...list, name: newName } : list))
    );
  };

  const handleAddList = () => {
    const newId = Date.now().toString();
    setLists(prev => [...prev, { id: newId, name: 'New List' }]);
  };

  const renderRightActions = (id: string) => (
    <DeleteButton onPress={() => handleDeleteList(id)}>
      <MaterialIcons name="delete" size={24} color="#fff" />
    </DeleteButton>
  );

  const renderItem = ({ item }: { item: List }) => {
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(item.name);

    const handleSubmit = () => {
      handleRenameList(item.id, name.trim() || 'Untitled');
      setEditing(false);
    };

    return (
      <Swipeable renderRightActions={() => renderRightActions(item.id)}>
        <ListItem onPress={() => navigation.navigate('ListScreen', { listId: item.id })}>
          {editing ? (
            <ListInput
              value={name}
              onChangeText={setName}
              onSubmitEditing={handleSubmit}
              onBlur={handleSubmit}
              autoFocus
            />
          ) : (
            <TouchableOpacity onPress={() => setEditing(true)} style={{ flex: 1 }}>
              <ListText>{item.name}</ListText>
            </TouchableOpacity>
          )}
        </ListItem>
      </Swipeable>
    );
  };

  return (
    <Container>
      <FlatList
        data={lists}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListFooterComponent={
          <AddButton onPress={handleAddList}>
            <MaterialIcons name="add" size={24} color="#fff" />
            <AddText>New List</AddText>
          </AddButton>
        }
      />
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: #121212;
  padding: 16px;
`;

const ListItem = styled.View`
  background-color: #1e1e1e;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 12px;
  flex-direction: row;
  align-items: center;
`;

const ListText = styled.Text`
  color: #fff;
  font-size: 18px;
`;

const ListInput = styled.TextInput`
  color: #fff;
  font-size: 18px;
  flex: 1;
`;

const DeleteButton = styled.TouchableOpacity`
  background-color: red;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 100%;
`;

const AddButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: #2a9d8f;
  padding: 16px;
  border-radius: 12px;
  margin-top: 8px;
`;

const AddText = styled.Text`
  color: #fff;
  font-size: 16px;
  margin-left: 8px;
`;

export default HomeScreen;
