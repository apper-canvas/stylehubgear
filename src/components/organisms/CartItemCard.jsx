import React from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Image from '@/components/atoms/Image';
import Heading from '@/components/atoms/Heading';
import Paragraph from '@/components/atoms/Paragraph';
import Button from '@/components/atoms/Button';
import QuantitySelector from '@/components/molecules/QuantitySelector';

const CartItemCard = ({ item, product, updateQuantity, removeItem, updating }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
    >
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-24 h-48 sm:h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
          <Image
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <Heading as="h3" className="font-semibold text-primary break-words">{product.name}</Heading>
          <Paragraph className="text-sm text-gray-500 mt-1">
            {item.size && <span>Size: {item.size}</span>}
            {item.size && item.color && <span className="mx-2">•</span>}
            {item.color && <span className="capitalize">Color: {item.color}</span>}
          </Paragraph>
          <Paragraph className="font-semibold text-accent mt-2">${item.price}</Paragraph>
        </div>

        <div className="flex items-center justify-between sm:justify-end sm:flex-col sm:items-end space-y-2">
          <QuantitySelector
            quantity={item.quantity}
            onDecrease={() => updateQuantity(item.id, item.quantity - 1)}
            onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
            disabled={updating[item.id]}
          />
          <Button
            onClick={() => removeItem(item.id)}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <ApperIcon name="Trash2" size={16} />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default CartItemCard;