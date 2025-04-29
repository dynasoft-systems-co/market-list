import React from 'react';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import styled from 'styled-components/native';
import { Item } from '../models/types';
import { MaterialIcons } from '@expo/vector-icons';

type Props = {
  items: Item[];
  groupId: string;
  onReorder: (newItems: Item[]) => void;
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

const ItemList = ({ items, groupId, onReorder }: Props) => {
  const renderItem = ({ item, drag, isActive }: RenderItemParams<Item>) => (
    <ItemContainer isActive={isActive}>
      <ItemText>{item.name}</ItemText>
      <DragHandle onPressIn={drag}>
        <MaterialIcons name="drag-handle" size={20} color="#aaa" />
      </DragHandle>
    </ItemContainer>
  );

  return (
    <DraggableFlatList
      data={items}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      onDragEnd={({ data }) => onReorder(data)}
      scrollEnabled={false}
    />
  );
};

export default ItemList;
