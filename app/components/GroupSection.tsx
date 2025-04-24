import React, { useState } from 'react';
import { FlatList } from 'react-native';
import styled from 'styled-components/native';
import { Group } from '../models/types';
import ItemRow from './ItemRow';
import ChevronIcon from './ChevronIcon';
import AddItemInput from './AddItemInput';

type Props = {
  group: Group;
  onAddItem: (groupId: string, itemName: string) => void;
  onRemoveItem: (groupId: string, itemId: string) => void;
  onRemoveGroup: (groupId: string) => void;
};

const Wrapper = styled.View`
  margin-bottom: 16px;
  border-bottom-width: 1px;
  border-color: #ccc;
`;

const Header = styled.TouchableOpacity`
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

const RemoveButton = styled.TouchableOpacity`
  padding: 4px 8px;
`;

const RemoveText = styled.Text`
  color: red;
`;

const GroupSection = ({
  group,
  onAddItem,
  onRemoveItem,
  onRemoveGroup,
}: Props) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <Wrapper>
      <Header onPress={() => setExpanded(!expanded)}>
        <GroupTitle>{group.name}</GroupTitle>
        <ChevronIcon direction={expanded ? 'down' : 'right'} />
      </Header>

      {expanded && (
        <>
          <FlatList
            data={group.items}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ItemRow
                item={item}
                onRemove={() => onRemoveItem(group.id, item.id)}
              />
            )}
          />
          <AddItemInput onAdd={(itemName) => onAddItem(group.id, itemName)} />
          <RemoveButton onPress={() => onRemoveGroup(group.id)}>
            <RemoveText>Remove Group</RemoveText>
          </RemoveButton>
        </>
      )}
    </Wrapper>
  );
};

export default GroupSection;
