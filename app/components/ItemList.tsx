import React, { useState } from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import { Swipeable } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';
import styled from 'styled-components/native';
import { Item } from '../models/types';

type Props = {
  items: Item[];
  groupId: string;
  onReorder: (newItems: Item[]) => void;
  onRemoveItem: (groupId: string, itemId: string) => void;
  onRenameItem: (groupId: string, itemId: string, newName: string) => void;
  onAddItem: (groupId: string, itemName: string) => void;
  onToggleDone: (groupId: string, itemId: string) => void;
  parentGestureHandlerRef: React.Ref<any>;
};

const ItemList = ({
  items,
  groupId,
  onRemoveItem,
  onRenameItem,
  onReorder,
  onAddItem,
  onToggleDone,
  parentGestureHandlerRef,
}: Props) => {
  const renderItem = ({ item, drag, isActive }: RenderItemParams<Item>) => {
    const [editing, setEditing] = useState(false);
    const [text, setText] = useState(item.name);

    const handleEndEditing = () => {
      onRenameItem(groupId, item.id, text.trim());
      setEditing(false);
    };

    const renderRightActions = () => (
      <TouchableOpacity
        style={{
          // backgroundColor: 'red',
          justifyContent: 'center',
          alignItems: 'center',
          width: 80,
          height: '100%',
        }}
        onPress={() => onRemoveItem(groupId, item.id)}
      >
        <MaterialIcons name="delete" size={24} color="#7216f4" />
      </TouchableOpacity>
    );

    return (
      <Swipeable renderRightActions={renderRightActions}>
        <ItemContainer isActive={isActive}>
          <CheckBoxTouchable style={{width:40}} onPress={() => onToggleDone(groupId, item.id)}>
            <MaterialIcons
              name={item.done ? 'check-box' : 'check-box-outline-blank'}
              size={24}
              color={item.done ? '#7216f4' : '#ccc'}
            />
          </CheckBoxTouchable>

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
            <MaterialIcons name="drag-handle" size={24} color="#aaa" />
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

interface ItemContainerProps {
  isActive: boolean;
}

const ItemContainer = styled.View<ItemContainerProps>`
  /* padding: 10px; */
  /* padding-left: 30px; */
  /* padding-right: 30px; */
  margin: 4px 16px;
  /* background-color: ${({ isActive }: ItemContainerProps) => (isActive ? '#e0e0e0' : 'white')}; */
  border-radius: 8px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const ItemText = styled.Text`
  font-size: 14px;
  flex: 1;
`;

const StyledInput = styled.TextInput`
  flex: 1;
  font-size: 14px;
`;

const DragHandle = styled.TouchableOpacity`
  padding: 8px;
`;

const CheckBoxTouchable = styled.TouchableOpacity`
  padding-right: 8px;
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

export default ItemList;
