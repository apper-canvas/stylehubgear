import React from 'react';
import Image from '@/components/atoms/Image';
import Button from '@/components/atoms/Button';

const ProductThumbnail = ({ src, alt, onClick, isSelected }) => {
  return (
    <Button
      onClick={onClick}
      className={`aspect-square rounded overflow-hidden border-2 transition-all duration-200 hover:border-gray-300 ${
        isSelected ? 'border-accent ring-2 ring-accent/20' : 'border-transparent'
      }`}
    >
      <Image 
        src={src} 
        alt={alt} 
        className="w-full h-full object-cover transition-transform duration-200 hover:scale-105" 
      />
    </Button>
  );
};

export default ProductThumbnail;