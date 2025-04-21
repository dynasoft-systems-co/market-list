import React, { useState } from 'react';
import { TouchableOpacity, FlatList } from 'react-native';
import styled from 'styled-components/native';
import { Group } from '../models/types';
import ItemRow from './ItemRow';
import ChevronIcon from './ChevronIcon';

type Props = {
  group: Group;
};

const Wrapper = styled.View`
  margin-bottom: 16px;
  border-bottom-width: 1px;
  border-color: #ccc;
`;

const Header = styled(TouchableOpacity)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: #f4f4f4;
`;

const GroupTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
`;

const GroupSection = ({ group }: Props) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <Wrapper>
      <Header onPress={() => setExpanded(!expanded)}>
        <GroupTitle>{group.name}</GroupTitle>
        <ChevronIcon direction={expanded ? 'down' : 'right'} />
      </Header>

      {expanded && (
        <FlatList
          data={group.items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ItemRow item={item} />}
        />
      )}
    </Wrapper>
  );
};

export default GroupSection;
