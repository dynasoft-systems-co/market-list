import React from 'react';
import styled from 'styled-components/native';
import { Item } from '../models/types';

type Props = {
  item: Item;
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

const ItemRow = ({ item }: Props) => {
  return (
    <Row>
      <ItemText checked={item.checked}>{item.name}</ItemText>
    </Row>
  );
};

export default ItemRow;
