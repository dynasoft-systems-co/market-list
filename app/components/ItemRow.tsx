import React from 'react';
import styled from 'styled-components/native';
import { Item } from '../models/types';
import { Text, TouchableOpacity } from 'react-native';

type Props = {
  item: Item;
  onRemove: () => void;
};

const Row = styled.View`
  padding: 10px 20px;
  background-color: #fff;
`;

const ItemText = styled.Text<{ checked: boolean }>`
  font-size: 16px;
  color: ${(props) => (props.checked ? '#999' : '#333')};
  text-decoration: ${(props) => (props.checked ? 'line-through' : 'none')};
`;

const ItemRow = ({ item, onRemove }: Props) => {
  return (
    <Row>
      <ItemText checked={item.checked}>{item.name}</ItemText>
      <TouchableOpacity onPress={onRemove}>
        <Text style={{ color: 'red' }}>Remove</Text>
      </TouchableOpacity>
    </Row>
  );
};

export default ItemRow;
