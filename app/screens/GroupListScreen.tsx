import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import DraggableFlatList, { RenderItemParams } from "react-native-draggable-flatlist";
import { Swipeable, PanGestureHandler } from "react-native-gesture-handler";
import uuid from "react-native-uuid";
import { MaterialIcons } from "@expo/vector-icons";
import styled from "styled-components/native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { Group, Item, List } from "../models/types";
import { loadShoppingLists, saveShoppingLists } from "../storage/useShoppingListStorage";
import AddGroupButton from "../components/AddGroupButton";
import ItemList from "../components/ItemList";
import { RootStackParamList } from "../../App";

const ListScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, "List">>();
  const CURRENT_LIST_ID = route.params.listId;
  const [allLists, setAllLists] = useState<List[]>([]);
  const [list, setList] = useState<List | null>(null);
  const [loading, setLoading] = useState(true);
  const gestureRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const loadedLists = await loadShoppingLists();
      setAllLists(loadedLists);

      const targetList = loadedLists.find((l) => l.id === CURRENT_LIST_ID) ?? {
        id: CURRENT_LIST_ID,
        name: "Nova Lista",
        groups: [],
      };

      setList(targetList);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!loading && list) {
      const updatedLists = allLists.map((l) => (l.id === list.id ? list : l));
      saveShoppingLists(updatedLists);
    }
  }, [list]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: list?.name,
    });
  }, [navigation, list]);

  const updateGroups = (updateFn: (groups: Group[]) => Group[]) => {
    if (!list) return;
    setList({ ...list, groups: updateFn(list.groups) });
  };

  const handleAddGroup = () => {
    const newGroup: Group = {
      id: uuid.v4() as string,
      name: `Group ${(list?.groups?.length ?? 0) + 1}`,
      items: [],
      collapsed: false,
    };
    updateGroups((prev) => [...prev, newGroup]);
  };

  const handleAddItem = (groupId: string, itemName: string) => {
    updateGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? {
              ...g,
              items: [...g.items, { id: uuid.v4() as string, name: itemName, done: false }],
            }
          : g
      )
    );
  };

  const handleRemoveItem = (groupId: string, itemId: string) => {
    updateGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, items: g.items.filter((i) => i.id !== itemId) } : g))
    );
  };

  const handleRemoveGroup = (groupId: string) => {
    updateGroups((prev) => prev.filter((g) => g.id !== groupId));
  };

  const handleRenameItem = (groupId: string, itemId: string, newName: string) => {
    updateGroups((prev) =>
      prev.map((group) =>
        group.id === groupId
          ? {
              ...group,
              items: group.items.map((item) => (item.id === itemId ? { ...item, name: newName } : item)),
            }
          : group
      )
    );
  };

  const handleReorderGroups = (data: Group[]) => {
    updateGroups(() => data);
  };

  const handleReorderItems = (newItems: Item[], groupId: string) => {
    updateGroups((prev) => prev.map((g) => (g.id === groupId ? { ...g, items: newItems } : g)));
  };

  const handleToggleDone = (groupId: string, itemId: string) => {
    updateGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? {
              ...g,
              items: g.items.map((item) =>
                item.id === itemId ? { ...item, done: !item.done } : item
              ),
            }
          : g
      )
    );
  };

  const renderGroup = ({ item, drag }: RenderItemParams<Group>) => {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(item.name);
    const [collapsed, setCollapsed] = useState(item.collapsed);

    const handleSubmit = () => {
      updateGroups((prev) => prev.map((g) => (g.id === item.id ? { ...g, name } : g)));
      setIsEditing(false);
    };

    const renderRightActions = () => (
      <TouchableOpacity
        style={{
          // backgroundColor: "red",
          justifyContent: "center",
          alignItems: "center",
          width: 80,
          height: "100%",
        }}
        onPress={() => handleRemoveGroup(item.id)}
      >
        <MaterialIcons name="delete" size={24} color="#7216f4" />
      </TouchableOpacity>
    );

    return (
      <Swipeable renderRightActions={renderRightActions} onSwipeableOpenStartDrag={() => setCollapsed((prev) => !prev)}>
        <GroupContainer>
          <GroupHeader>
            <TouchableOpacity style={{width:40}} onPress={() => setCollapsed((prev) => !prev)}>
              <MaterialIcons name={!collapsed ? "expand-less" : "expand-more"} size={30} color="#7216f4" />
            </TouchableOpacity>
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
              <MaterialIcons name="drag-handle" size={20} color="#7216f4" />
            </DragHandle>
          </GroupHeader>

            {!collapsed && (
              <ItemList
                items={item.items}
                groupId={item.id}
                onReorder={(newItems) => handleReorderItems(newItems, item.id)}
                onRenameItem={(itemId, newName) => handleRenameItem(item.id, itemId, newName)}
                onRemoveItem={handleRemoveItem}
                onAddItem={handleAddItem}
                onToggleDone={handleToggleDone}
                parentGestureHandlerRef={gestureRef}
              />
            )}
        </GroupContainer>
      </Swipeable>
    );
  };

  if (loading || !list) {
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
          data={list.groups}
          keyExtractor={(item) => item.id}
          renderItem={renderGroup}
          onDragEnd={({ data }) => handleReorderGroups(data)}
          ListFooterComponent={
            <View style={{ paddingVertical: 20 }}>
              <AddGroupButton onPress={handleAddGroup} />
            </View>
          }
        />
      </Container>
    </PanGestureHandler>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: white;
`;

const GroupContainer = styled.View`
  margin: 10px 0;
  /* background-color: #fff; */
  border-radius: 12px;
  overflow: hidden;
  /* elevation: 2; */
`;

const GroupHeader = styled.View`
  padding: 10px 12px;
  /* background-color: #7216f4; */
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const GroupInput = styled.TextInput`
  /* color: #fff; */
  color: #7216f4;
  font-size: 22px;
  font-weight: bold;
  border-bottom-width: 1px;
  /* border-color: #fff; */
  margin-right: 8px;
  flex: 1;
`;

const GroupTitle = styled.Text`
  /* color: #fff; */
  color: #7216f4;
  font-size: 22px;
  font-weight: bold;
  flex: 1;
`;

const DragHandle = styled.TouchableOpacity`
  padding: 4px;
`;

export default ListScreen;
