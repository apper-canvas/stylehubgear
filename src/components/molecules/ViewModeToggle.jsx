import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const ViewModeToggle = ({ viewMode, onToggle }) => {
  return (
    <div className="flex items-center space-x-2">
      <Button
        onClick={() => onToggle('grid')}
        className={`p-2 border rounded ${
          viewMode === 'grid' ? 'bg-primary text-white' : 'border-gray-300'
        }`}
      >
        <ApperIcon name="Grid3X3" size={16} />
      </Button>
      <Button
        onClick={() => onToggle('list')}
        className={`p-2 border rounded ${
          viewMode === 'list' ? 'bg-primary text-white' : 'border-gray-300'
        }`}
      >
        <ApperIcon name="List" size={16} />
      </Button>
    </div>
  );
};

export default ViewModeToggle;