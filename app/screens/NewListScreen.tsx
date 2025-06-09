import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import uuid from "react-native-uuid";
import styled from "styled-components/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { GroupList, List, ListType } from "../models/types";
import { countShoppingLists, insertShoppingLists } from "../storage/useShoppingListStorage";
import { insertGroupLists } from "../storage/useGroupListStorage";

type RootStackParamList = {
  Home: undefined;
  List: { listId: string };
};

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

const NewListScreen = ({ navigation }: Props) => {
  const [name, setName] = useState("list");
  const [type, setType] = useState<ListType>("list");

  useEffect(() => {
    (async () => {
      const count = await countShoppingLists();
      setName(`New List ${count}`);
    })();
  }, []);

  const handleAddList = async () => {
    if (type === "group") {
      const newList: GroupList = {
        id: uuid.v4() as string,
        name,
        groups: [],
      };

      await insertGroupLists(newList);
      navigation.navigate("GroupList", { listId: newList.id });
    } else {
      const newList: List = {
        id: uuid.v4() as string,
        name,
        items: [],
      };

      await insertShoppingLists(newList);
      navigation.navigate("List", { listId: newList.id });
    }
  };

  return (
    <Container>
      <Label>List Name</Label>
      <Input value={name} onChangeText={setName} placeholder="Enter list name" />

      <Label>List Type</Label>
      <TypeSelector>
        <TypeOption selected={type === "list"} onPress={() => setType("list")}>
          <TypeText selected={type === "list"}>List</TypeText>
        </TypeOption>
        <TypeOption selected={type === "group"} onPress={() => setType("group")}>
          <TypeText selected={type === "group"}>Group</TypeText>
        </TypeOption>
      </TypeSelector>

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

const Label = styled.Text`
  font-weight: bold;
  margin-top: 20px;
  margin-bottom: 8px;
`;

const Input = styled.TextInput`
  border: 1px solid #ccc;
  padding: 12px;
  border-radius: 8px;
`;

const TypeSelector = styled.View`
  flex-direction: row;
  gap: 12px;
  margin-bottom: 12px;
`;

const TypeOption = styled.TouchableOpacity<{ selected: boolean }>`
  padding: 12px 20px;
  background-color: ${({ selected }) => (selected ? "#7216f4" : "#eee")};
  border-radius: 8px;
`;

const TypeText = styled.Text<{ selected: boolean }>`
  color: ${({ selected }) => (selected ? "#fff" : "#333")};
  font-weight: bold;
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

export default NewListScreen;
