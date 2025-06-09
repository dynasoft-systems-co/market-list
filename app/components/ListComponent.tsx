import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import DraggableFlatList, { RenderItemParams } from "react-native-draggable-flatlist";
import { Swipeable, PanGestureHandler } from "react-native-gesture-handler";
import uuid from "react-native-uuid";
import { MaterialIcons } from "@expo/vector-icons";
import styled from "styled-components/native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { List, Item, GroupList } from "../models/types";
import { loadShoppingListById, loadShoppingLists, saveShoppingLists } from "../storage/useShoppingListStorage";
import AddGroupButton from "./AddGroupButton";
import ItemList from "./ItemList";
import ItemRow from "./ItemRow";
import { RootStackParamList } from "../../App";

const ListComponent = () => {
  const route = useRoute<RouteProp<RootStackParamList, "List">>();
  const CURRENT_LIST_ID = route.params.listId;
  const [allLists, setAllLists] = useState<List[]>([]);
  const [list, setList] = useState<List | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDoneItems, setShowDoneItems] = useState(false);
  const gestureRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const loadedList = await loadShoppingListById(CURRENT_LIST_ID);
      if(loadedList.id === ""){
        console.log("error: empty list loaded")
      }
      setList(loadedList);
      setLoading(false);
    })();
  }, []);

  // useEffect(() => {
  //   if (!loading && list) {
  //     const updatedLists = allLists.map((l) => (l.id === list.id ? list : l));
  //     saveShoppingLists(updatedLists);
  //   }
  // }, [list]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: list?.name,
    });
  }, [navigation, list]);

  const handleAddItem = (itemName: string) => {
    if (!list){
      console.log("trying to add at null list");
      return;
    }

    setList(
      {
        ...list,
        items: [
          ...list.items,
          { id: uuid.v4() as string, name: itemName, done: false, order: list.items.length + 1 }
        ]
      }
    );
  };

  const handleRemoveItem = (itemId: string) => {
    if (!list){
      console.log("trying to add at null list");
      return;
    }
    
    setList(
      {
        ...list,
        items: list.items.filter((i) => i.id !== itemId)
      }
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

  const handleReorderGroups = (data: List[]) => {
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

  const renderGroup = ({ item, drag }: RenderItemParams<List>) => {
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

    const undoneItems = item.items.filter((i) => !i.done);

    return (
      <Swipeable renderRightActions={renderRightActions} onSwipeableOpenStartDrag={() => setCollapsed((prev) => !prev)}>
        <GroupContainer>
          <GroupHeader>
            <TouchableOpacity onPress={() => setCollapsed((prev) => !prev)}>
              <MaterialIcons name={!collapsed ? "expand-less" : "expand-more"} size={20} color="#7216f4" />
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
                items={undoneItems}
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

  const renderMarkedItems = () => {
    const markedGroups = list?.groups
      .map((group) => ({
        id: group.id,
        name: group.name,
        items: group.items.filter((item) => item.done),
      }))
      .filter((g) => g.items.length > 0);

    if (!markedGroups || markedGroups.length === 0) return null;

    return (
      <MarkedContainer>
        <TouchableOpacity onPress={() => setShowDoneItems((prev) => !prev)}>
          <MarkedHeader>
            <MarkedTitle>Itens Marcados</MarkedTitle>
            <MaterialIcons name={showDoneItems ? "expand-less" : "expand-more"} size={24} color="#7216f4" />
          </MarkedHeader>
        </TouchableOpacity>

        {showDoneItems &&
          markedGroups.map((group) => (
            <GroupContainer key={group.id}>
              <GroupHeader style={{
                //  backgroundColor: "#ccc"
                  }}>
                <GroupTitle style={{ color: "#333" }}>{group.name}</GroupTitle>
              </GroupHeader>
              {group.items.map((item) => (
                <ItemRow
                  key={item.id}
                  item={item}
                  groupId={group.id}
                  onToggleDone={() => handleToggleDone(group.id, item.id)}
                  onRename={(newName) => handleRenameItem(group.id, item.id, newName)}
                  onRemove={() => handleRemoveItem(group.id, item.id)}
                />
              ))}
            </GroupContainer>
          ))}
      </MarkedContainer>
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
        />
        <AddGroupButton onPress={handleAddGroup} />
        {renderMarkedItems()}
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
  padding: 12px 16px;
  /* background-color: #7216f4; */
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const GroupInput = styled.TextInput`
  /* color: #fff; */
  color: #7216f4;
  font-size: 16px;
  font-weight: bold;
  border-bottom-width: 1px;
  /* border-color: #fff; */
  margin-right: 8px;
  flex: 1;
`;

const GroupTitle = styled.Text`
  /* color: #fff; */
  color: #7216f4;
  font-size: 16px;
  font-weight: bold;
  flex: 1;
`;

const DragHandle = styled.TouchableOpacity`
  padding: 4px;
`;

const MarkedContainer = styled.View`
  margin: 10px 16px 30px;
`;

const MarkedHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
`;

const MarkedTitle = styled.Text`
  font-size: 16px;
  /* color: #7216f4; */
  font-weight: bold;
`;

export default ListComponent;
