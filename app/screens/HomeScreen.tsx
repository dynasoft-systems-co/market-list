import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity } from 'react-native';
import uuid from 'react-native-uuid';
import styled from 'styled-components/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { List } from '../models/types';
import {
  loadShoppingLists,
  saveShoppingLists,
} from '../storage/useShoppingListStorage';

type RootStackParamList = {
  Home: undefined;
  List: { listId: string };
};

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen = ({ navigation }: Props) => {
  const [lists, setLists] = useState<List[]>([]);

  useEffect(() => {
    (async () => {
      const loaded = await loadShoppingLists();
      setLists(loaded);
    })();
  }, []);

  const handleAddList = async () => {
    const newList: List = {
      id: uuid.v4() as string,
      name: `New List ${lists.length + 1}`,
      groups: [],
    };
    const updated = [...lists, newList];
    await saveShoppingLists(updated);
    setLists(updated);
    navigation.navigate('List', { listId: newList.id });
  };

  const handleOpenList = (id: string) => {
    navigation.navigate('List', { listId: id });
  };

  return (
    <Container>
      <FlatList
        data={lists}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ListButton onPress={() => handleOpenList(item.id)}>
            <ListName>{item.name}</ListName>
          </ListButton>
        )}
      />

      <AddButton onPress={handleAddList}>
        <AddButtonText>Create New List</AddButtonText>
      </AddButton>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: #fff;
  padding: 20px;
`;

const ListButton = styled.TouchableOpacity`
  padding: 16px;
  background-color: #eee;
  border-radius: 8px;
  margin-bottom: 12px;
`;

const ListName = styled.Text`
  font-size: 16px;
  font-weight: 500;
`;

const AddButton = styled.TouchableOpacity`
  background-color: #7216f4;
  padding: 16px;
  border-radius: 8px;
  align-items: center;
  margin-top: 20px;
`;

const AddButtonText = styled.Text`
  color: #fff;
  font-weight: bold;
`;

export default HomeScreen;
