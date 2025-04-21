import React from 'react';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  direction: 'down' | 'right';
};

const ChevronIcon = ({ direction }: Props) => {
  return (
    <Ionicons
      name={direction === 'down' ? 'chevron-down' : 'chevron-forward'}
      size={20}
      color="#555"
    />
  );
};

export default ChevronIcon;
