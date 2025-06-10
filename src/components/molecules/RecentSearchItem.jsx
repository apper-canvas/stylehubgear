import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Paragraph from '@/components/atoms/Paragraph';

const RecentSearchItem = ({ searchTerm, onClick }) => {
  return (
    <Button
      onClick={() => onClick(searchTerm)}
      className="flex items-center space-x-2 w-full p-2 text-left hover:bg-gray-50 rounded transition-colors"
    >
      <ApperIcon name="Clock" size={16} className="text-gray-400" />
      <Paragraph className="text-sm text-gray-700">{searchTerm}</Paragraph>
    </Button>
  );
};

export default RecentSearchItem;