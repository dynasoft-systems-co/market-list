import React from 'react';
import styled from 'styled-components/native';

type Props = {
  onPress: () => void;
};

const AddGroupButton = ({ onPress }: Props) => {
  return (
    <Button onPress={onPress}>
      <ButtonText>Add Group</ButtonText>
    </Button>
  );
};

const Button = styled.TouchableOpacity`
  padding: 16px;
  background-color: #7216f4;
  margin: 20px;
  border-radius: 10px;
  align-items: center;
`;

const ButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: bold;
`;

export default AddGroupButton;
