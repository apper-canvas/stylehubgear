import React from 'react';
import { NavLink } from 'react-router-dom';
import Image from '@/components/atoms/Image';
import Heading from '@/components/atoms/Heading';
import Paragraph from '@/components/atoms/Paragraph';

const SearchResultItem = ({ product, onClick }) => {
  return (
    <NavLink
      to={`/product/${product.id}`}
      onClick={onClick}
      className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
    >
      <Image
        src={product.images[0]}
        alt={product.name}
        className="w-12 h-12 rounded"
      />
      <div className="flex-1 min-w-0">
        <Heading as="h4" className="font-medium text-gray-900 break-words">{product.name}</Heading>
        <Paragraph className="text-sm text-accent font-semibold">${product.price}</Paragraph>
      </div>
    </NavLink>
  );
};

export default SearchResultItem;