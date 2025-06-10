import React from 'react';
import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Heading';

const ProductVariantSelector = ({ label, options, selectedOption, onSelect, type = 'text' }) => {
  return (
    <div>
      <Heading as="h3" className="font-semibold mb-3">{label}</Heading>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <Button
            key={option}
            onClick={() => onSelect(option)}
            className={`px-4 py-2 border rounded transition-colors ${
              selectedOption === option
                ? 'border-accent bg-accent text-white'
                : 'border-gray-300 hover:border-gray-400'
            } ${type === 'color' ? 'capitalize' : ''}`}
          >
            {option}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ProductVariantSelector;