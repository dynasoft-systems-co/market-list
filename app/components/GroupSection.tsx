import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity } from 'react-native';
import { Group } from '../models/types';
import styled from 'styled-components/native';

interface Props {
  group: Group;
  onAddItem: (groupId: string, itemName: string) => void;
  onRemoveItem: (groupId: string, itemId: string) => void;
  onRemoveGroup: (groupId: string) => void;
  onMoveGroup: (groupId: string, direction: 'up' | 'down') => void;
  onMoveItem: (groupId: string, itemId: string, direction: 'up' | 'down') => void;
}

const GroupSection = ({
  group,
  onAddItem,
  onRemoveItem,
  onRemoveGroup,
  onMoveGroup,
  onMoveItem,
}: Props) => {
  const [inputText, setInputText] = useState('');
  const [collapsed, setCollapsed] = useState(false);

  const handleAdd = () => {
    if (inputText.trim()) {
      onAddItem(group.id, inputText.trim());
      setInputText('');
    }
  };

  return (
    <GroupContainer>
      <GroupHeader>
        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{group.name}</Text>
        <GroupActions>
          <TouchableOpacity onPress={() => setCollapsed((prev) => !prev)}>
            <ActionText>{collapsed ? '▶' : '▼'}</ActionText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onMoveGroup(group.id, 'up')}>
            <ActionText>↑</ActionText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onMoveGroup(group.id, 'down')}>
            <ActionText>↓</ActionText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onRemoveGroup(group.id)}>
            <ActionText>✕</ActionText>
          </TouchableOpacity>
        </GroupActions>
      </GroupHeader>

      {!collapsed && (
        <>
          {group.items
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((item, index) => (
              <ItemRow key={item.id}>
                <Text style={{ flex: 1 }}>{item.name}</Text>
                <ItemActions>
                  <TouchableOpacity onPress={() => onMoveItem(group.id, item.id, 'up')}>
                    <ActionText>↑</ActionText>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => onMoveItem(group.id, item.id, 'down')}>
                    <ActionText>↓</ActionText>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => onRemoveItem(group.id, item.id)}>
                    <ActionText>✕</ActionText>
                  </TouchableOpacity>
                </ItemActions>
              </ItemRow>
            ))}

          <AddItemRow>
            <ItemInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="New item..."
              onSubmitEditing={handleAdd}
              returnKeyType="done"
            />
            <TouchableOpacity onPress={handleAdd}>
              <ActionText style={{ fontSize: 20, marginLeft: 8 }}>＋</ActionText>
            </TouchableOpacity>
          </AddItemRow>
        </>
      )}
    </GroupContainer>
  );
};

export default GroupSection;

// Styled components
const GroupContainer = styled.View`
  margin-bottom: 24px;
  padding: 12px;
  background-color: #f4f4f4;
  border-radius: 12px;
`;

const GroupHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const GroupActions = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

const ActionText = styled.Text`
  font-size: 18px;
  padding: 4px;
`;

const ItemRow = styled.View`
  flex-direction: row;
  align-items: center;
  padding-vertical: 4px;
`;

const ItemActions = styled.View`
  flex-direction: row;
  gap: 8px;
`;

const AddItemRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 8px;
`;

const ItemInput = styled.TextInput`
  flex: 1;
  border: 1px solid #ccc;
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 16px;
`;
