import React, { useState } from 'react';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import { Swipeable } from 'react-native-gesture-handler';
import styled from 'styled-components/native';
import { Item } from '../models/types';
import { MaterialIcons } from '@expo/vector-icons';
import { TextInput, TouchableOpacity, View } from 'react-native';

type Props = {
  items: Item[];
  groupId: string;
  onReorder: (newItems: Item[]) => void;
  onRemoveItem: (groupId: string, itemId: string) => void;
  onRenameItem: (itemId: string, newName: string) => void;
  onAddItem: (groupId: string, itemName: string) => void;
  parentGestureHandlerRef: React.Ref<any>;
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

const AddButton = styled.TouchableOpacity`
  padding: 10px 16px;
  flex-direction: row;
  align-items: center;
`;

const AddText = styled.Text`
  color: #7216f4;
  font-weight: bold;
  margin-left: 8px;
`;

const ItemList = ({ items, groupId, onRemoveItem, onRenameItem, onReorder, onAddItem, parentGestureHandlerRef }: Props) => {
  const renderItem = ({ item, drag, isActive }: RenderItemParams<Item>) => {
    const [editing, setEditing] = useState(false);
    const [text, setText] = useState(item.name);
  
    const handleEndEditing = () => {
      onRenameItem(item.id, text.trim());
      setEditing(false);
    };
  
    const renderRightActions = () => (
      <TouchableOpacity
        style={{
          backgroundColor: 'red',
          justifyContent: 'center',
          alignItems: 'center',
          width: 80,
          height: '100%',
        }}
        onPress={() => onRemoveItem(groupId, item.id)}
      >
        <MaterialIcons name="delete" size={24} color="#fff" />
      </TouchableOpacity>
    );
  
    return (
      <Swipeable renderRightActions={renderRightActions}>
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
      </Swipeable>
    );
  };

  return (
    <View>
      <DraggableFlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        onDragEnd={({ data }) => onReorder(data)}
        scrollEnabled={false}
        activationDistance={10}
        simultaneousHandlers={parentGestureHandlerRef}
      />
      <AddButton onPress={() => onAddItem(groupId, `Item ${items.length + 1}`)}>
        <MaterialIcons name="add" size={20} color="#7216f4" />
        <AddText>Adicionar Item</AddText>
      </AddButton>
    </View>
  );
};

export default ItemList;
