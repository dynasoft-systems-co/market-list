import React, { useRef, useState } from 'react';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import { PanGestureHandler } from 'react-native-gesture-handler';
import styled from 'styled-components/native';
import { Item } from '../models/types';
import { MaterialIcons } from '@expo/vector-icons';
import { TextInput, TouchableOpacity } from 'react-native';

type Props = {
  items: Item[];
  groupId: string;
  onReorder: (newItems: Item[]) => void;
  onRenameItem: (itemId: string, newName: string) => void;
  parentGestureHandlerRef: React.Ref<any>; // <- nova prop
};

const ItemContainer = styled.View<{ isActive: boolean }>`
  padding: 10px;
  margin: 4px 16px;
  background-color: ${({ isActive }) => (isActive ? '#e0e0e0' : 'white')};
  border-radius: 8px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const ItemText = styled.Text`
  font-size: 14px;
  flex: 1;
`;

const DragHandle = styled.TouchableOpacity`
  padding: 8px;
`;

const StyledInput = styled.TextInput`
  flex: 1;
  font-size: 14px;
`;

const ItemList = ({ items, groupId, onRenameItem, onReorder, parentGestureHandlerRef }: Props) => {
  const renderItem = ({ item, drag, isActive }: RenderItemParams<Item>) => {
    const [editing, setEditing] = useState(false);
    const [text, setText] = useState(item.name);

    const handleEndEditing = () => {
      onRenameItem(item.id, text.trim());
      setEditing(false);
    };

    return (
      <ItemContainer isActive={isActive}>
        {editing ? (
          <StyledInput
            value={text}
            onChangeText={setText}
            onBlur={handleEndEditing}
            onSubmitEditing={handleEndEditing}
            autoFocus
          />
        ) : (
          <TouchableOpacity style={{ flex: 1 }} onPress={() => setEditing(true)}>
            <ItemText>{item.name}</ItemText>
          </TouchableOpacity>
        )}

        <DragHandle onPressIn={drag}>
          <MaterialIcons name="drag-handle" size={20} color="#aaa" />
        </DragHandle>
      </ItemContainer>
    );
  };

  return (
    <DraggableFlatList
      data={items}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      onDragEnd={({ data }) => onReorder(data)}
      scrollEnabled={false}
      activationDistance={10}
      simultaneousHandlers={parentGestureHandlerRef}
    />
  );
};

export default ItemList;
