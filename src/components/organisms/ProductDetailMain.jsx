import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { cartService } from '@/services';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Heading';
import Paragraph from '@/components/atoms/Paragraph';
import Image from '@/components/atoms/Image';
import ProductThumbnail from '@/components/molecules/ProductThumbnail';
import ProductVariantSelector from '@/components/molecules/ProductVariantSelector';
import QuantitySelector from '@/components/molecules/QuantitySelector';

const ProductDetailMain = ({ product }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '');
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  const handleAddToCart = async () => {
    if (product.sizes?.length > 0 && !selectedSize) {
      toast.error('Please select a size');
      return;
    }

    setAddingToCart(true);
    try {
      const cartItem = {
        productId: product.id,
        quantity,
        size: selectedSize,
        color: selectedColor,
        price: product.price
      };

      await cartService.create(cartItem);
      toast.success('Added to cart!');
    } catch (err) {
      toast.error('Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div className="space-y-4">
        <motion.div
          key={selectedImage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="aspect-square bg-gray-100 rounded-lg overflow-hidden"
        >
          <Image
            src={product.images[selectedImage]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </motion.div>

        {product.images.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((image, index) => (
              <ProductThumbnail
                key={index}
                src={image}
                alt={`${product.name} ${index + 1}`}
                onClick={() => setSelectedImage(index)}
                isSelected={selectedImage === index}
              />
            ))}
          </div>
        )}
      </div>

      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Heading as="h1" className="text-3xl font-bold text-primary mb-2">{product.name}</Heading>
          <Paragraph className="text-2xl font-semibold text-accent">${product.price}</Paragraph>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Paragraph className="text-gray-600 leading-relaxed">{product.description}</Paragraph>
        </motion.div>

        {product.sizes && product.sizes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <ProductVariantSelector
              label="Size"
              options={product.sizes}
              selectedOption={selectedSize}
              onSelect={setSelectedSize}
            />
          </motion.div>
        )}

        {product.colors && product.colors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <ProductVariantSelector
              label="Color"
              options={product.colors}
              selectedOption={selectedColor}
              onSelect={setSelectedColor}
              type="color"
            />
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Heading as="h3" className="font-semibold mb-3">Quantity</Heading>
          <QuantitySelector
            quantity={quantity}
            onDecrease={() => setQuantity(prev => Math.max(1, prev - 1))}
            onIncrease={() => setQuantity(prev => prev + 1)}
            className="space-x-3" // Larger spacing for detail page
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddToCart}
            disabled={addingToCart || !product.inStock}
            className={`w-full py-4 px-6 font-semibold rounded transition-colors ${
              product.inStock
                ? 'bg-accent text-white hover:bg-accent/90'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {addingToCart ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Adding to Cart...</span>
              </div>
            ) : !product.inStock ? (
              'Out of Stock'
            ) : (
              'Add to Cart'
            )}
          </motion.button>

          <Button className="w-full py-4 px-6 border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold rounded transition-colors">
            Add to Wishlist
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="border-t pt-6 space-y-4"
        >
          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer font-semibold">
              Product Details
              <ApperIcon name="ChevronDown" size={16} className="group-open:rotate-180 transition-transform" />
            </summary>
            <div className="mt-3 text-gray-600 text-sm space-y-2">
              <Paragraph>• Premium quality materials</Paragraph>
              <Paragraph>• Machine washable</Paragraph>
              <Paragraph>• Regular fit</Paragraph>
              <Paragraph>• Model is 6'0" wearing size M</Paragraph>
            </div>
          </details>

          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer font-semibold">
              Shipping & Returns
              <ApperIcon name="ChevronDown" size={16} className="group-open:rotate-180 transition-transform" />
            </summary>
            <div className="mt-3 text-gray-600 text-sm space-y-2">
              <Paragraph>• Free shipping on orders over $100</Paragraph>
              <Paragraph>• 30-day return policy</Paragraph>
              <Paragraph>• Express delivery available</Paragraph>
            </div>
          </details>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetailMain;