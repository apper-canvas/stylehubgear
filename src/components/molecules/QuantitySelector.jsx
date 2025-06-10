import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const QuantitySelector = ({ quantity, onDecrease, onIncrease, disabled = false, className = '' }) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Button
        onClick={onDecrease}
        disabled={disabled || quantity <= 1}
        className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:border-gray-400 transition-colors disabled:opacity-50"
      >
        <ApperIcon name="Minus" size={14} />
      </Button>
      <span className="w-8 text-center font-semibold">{quantity}</span>
      <Button
        onClick={onIncrease}
        disabled={disabled}
        className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:border-gray-400 transition-colors disabled:opacity-50"
      >
        <ApperIcon name="Plus" size={14} />
      </Button>
    </div>
  );
};

export default QuantitySelector;