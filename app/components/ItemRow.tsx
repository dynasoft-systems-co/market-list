import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { MaterialIcons } from '@expo/vector-icons';
import { Item } from '../models/types';

type Props = {
  item: Item;
  groupId: string;
  onToggleDone: () => void;
  onRename: (newName: string) => void;
  onRemove: () => void;
};

const ItemRow = ({ item, onToggleDone, onRename, onRemove }: Props) => {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(item.name);

  const handleEndEditing = () => {
    onRename(text.trim());
    setEditing(false);
  };

  return (
    <Container>
      <CheckBoxTouchable onPress={onToggleDone}>
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

      <IconButton onPress={onRemove}>
        <MaterialIcons name="delete" size={20} color="#c00" />
      </IconButton>
    </Container>
  );
};

const Container = styled.View`
  padding: 10px;
  margin: 4px 16px;
  /* background-color: #f0f0f0; */
  border-radius: 8px;
  flex-direction: row;
  align-items: center;
`;

const ItemText = styled.Text`
  font-size: 14px;
  flex: 1;
`;

const StyledInput = styled.TextInput`
  flex: 1;
  font-size: 14px;
`;

const CheckBoxTouchable = styled.TouchableOpacity`
  padding-right: 8px;
`;

const IconButton = styled.TouchableOpacity`
  padding: 8px;
`;

export default ItemRow;
