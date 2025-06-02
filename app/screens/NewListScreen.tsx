import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity } from 'react-native';
import uuid from 'react-native-uuid';
import styled from 'styled-components/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { List, ListType } from '../models/types';
import {
  countShoppingLists,
  insertShoppingLists,
} from '../storage/useShoppingListStorage';

type RootStackParamList = {
  Home: undefined;
  List: { listId: string };
};

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen = ({ navigation }: Props) => {
  const [name, setName] = useState("list");
  const [type, setType] = useState<ListType>("list");

  useEffect(() => {
    (async () => {
      const count = await countShoppingLists();
      setName(`New List ${count}`);
    })();
  }, []);

  const handleAddList = async () => {
    const newList: List = {
      id: uuid.v4() as string,
      name: name,
      groups: [],
      type: type
    };
    await insertShoppingLists(newList);
    navigation.navigate('List', { listId: newList.id });
  };

  return (
    <Container>
      

      <AddButton onPress={handleAddList}>
        <AddButtonText>Create New List</AddButtonText>
      </AddButton>
    </Container>
  );
};

const Container = styled.ScrollView`
  flex: 1;
  background-color: #fff;
  padding: 20px;
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
