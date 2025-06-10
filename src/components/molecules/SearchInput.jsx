import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';

const SearchInput = ({ query, onQueryChange, onClose, placeholder = 'Search products...' }) => {
  return (
    <div className="relative">
      <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
      <Input
        type="text"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder={placeholder}
        className="pl-10 pr-4 py-3"
        autoFocus
      />
      {onClose && (
        <Button
          onClick={onClose}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ApperIcon name="X" size={20} />
        </Button>
      )}
    </div>
  );
};

export default SearchInput;