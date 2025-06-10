import React from 'react';
import Image from '@/components/atoms/Image';
import Button from '@/components/atoms/Button';

const ProductThumbnail = ({ src, alt, onClick, isSelected }) => {
  return (
    <Button
      onClick={onClick}
      className={`aspect-square rounded overflow-hidden border-2 transition-colors ${
        isSelected ? 'border-accent' : 'border-transparent'
      }`}
    >
      <Image src={src} alt={alt} className="w-full h-full object-cover" />
    </Button>
  );
};

export default ProductThumbnail;