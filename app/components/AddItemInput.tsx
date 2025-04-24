import React, { useState } from 'react';
import styled from 'styled-components/native';

type Props = {
  onAdd: (text: string) => void;
};

const Container = styled.View`
  flex-direction: row;
  padding: 8px 16px;
`;

const Input = styled.TextInput`
  flex: 1;
  border: 1px solid #ccc;
  padding: 8px;
  border-radius: 6px;
`;

const AddButton = styled.TouchableOpacity`
  background-color: #7216f4;
  padding: 8px 12px;
  margin-left: 8px;
  border-radius: 6px;
`;

const ButtonText = styled.Text`
  color: white;
`;

const AddItemInput = ({ onAdd }: Props) => {
  const [text, setText] = useState('');

  const handleAdd = () => {
    if (text.trim().length > 0) {
      onAdd(text.trim());
      setText('');
    }
  };

  return (
    <Container>
      <Input
        placeholder="Add item"
        value={text}
        onChangeText={setText}
        onSubmitEditing={handleAdd}
        returnKeyType="done"
      />
      <AddButton onPress={handleAdd}>
        <ButtonText>Add</ButtonText>
      </AddButton>
    </Container>
  );
};

export default AddItemInput;
