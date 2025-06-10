import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [isZoomed, setIsZoomed] = useState(false);

  // Update image when color changes
  useEffect(() => {
    if (selectedColor && product.colorImages && product.colorImages[selectedColor]) {
      const colorImageIndex = product.images.findIndex(img => 
        img === product.colorImages[selectedColor][0]
      );
      if (colorImageIndex !== -1) {
        setSelectedImage(colorImageIndex);
      }
    }
  }, [selectedColor, product]);

  // Get images for selected color or all images
  const getDisplayImages = () => {
    if (selectedColor && product.colorImages && product.colorImages[selectedColor]) {
      return product.colorImages[selectedColor];
    }
    return product.images || [];
  };

  const displayImages = getDisplayImages();
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
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          <motion.div
            key={`${selectedImage}-${selectedColor}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="aspect-square bg-gray-100 rounded-lg overflow-hidden image-zoom-container"
            onClick={() => setIsZoomed(true)}
          >
            <Image
              src={displayImages[selectedImage] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/20">
              <div className="bg-white/90 px-3 py-1 rounded-full text-sm font-medium">
                <ApperIcon name="ZoomIn" size={16} className="inline mr-1" />
                Click to zoom
              </div>
            </div>
          </motion.div>

          {displayImages.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {displayImages.map((image, index) => (
                <ProductThumbnail
                  key={`${index}-${selectedColor}`}
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  onClick={() => setSelectedImage(index)}
                  isSelected={selectedImage === index}
                />
              ))}
            </div>
          )}
        </div>
{/* Product Information */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Heading as="h1" className="text-3xl font-bold text-primary mb-2">{product.name}</Heading>
            <div className="flex items-center gap-4 mb-2">
              <Paragraph className="text-2xl font-semibold text-accent">${product.price}</Paragraph>
              {product.originalPrice && (
                <Paragraph className="text-lg text-gray-500 line-through">${product.originalPrice}</Paragraph>
              )}
              {product.discount && (
                <span className="offer-badge text-white px-2 py-1 rounded text-sm font-bold">
                  {product.discount}% OFF
                </span>
              )}
            </div>
          </motion.div>

          {/* Reviews & Ratings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="flex items-center gap-3"
          >
            <div className="star-rating">
              {[...Array(5)].map((_, i) => (
                <ApperIcon
                  key={i}
                  name="Star"
                  size={16}
                  className={i < Math.floor(product.rating || 4.5) ? 'star-filled' : 'star-empty'}
                  fill={i < Math.floor(product.rating || 4.5) ? 'currentColor' : 'none'}
                />
              ))}
            </div>
            <Paragraph className="text-sm text-gray-600">
              {product.rating || 4.5} ({product.reviewCount || 128} reviews)
            </Paragraph>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Paragraph className="text-gray-600 leading-relaxed">{product.description}</Paragraph>
          </motion.div>

          {/* Offers */}
          {product.offers && product.offers.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-green-50 border border-green-200 rounded-lg p-4"
            >
              <Heading as="h4" className="text-green-800 font-semibold mb-2 flex items-center">
                <ApperIcon name="Tag" size={16} className="mr-2" />
                Special Offers
              </Heading>
              <div className="space-y-1">
                {product.offers.map((offer, index) => (
                  <Paragraph key={index} className="text-green-700 text-sm">• {offer}</Paragraph>
                ))}
              </div>
            </motion.div>
          )}

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

{/* Enhanced Product Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="border-t pt-6 space-y-4"
          >
            <details className="group product-detail-section p-4">
              <summary className="flex items-center justify-between cursor-pointer font-semibold">
                Product Details
                <ApperIcon name="ChevronDown" size={16} className="group-open:rotate-180 transition-transform" />
              </summary>
              <div className="mt-4 space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Paragraph className="font-medium text-gray-900">Material</Paragraph>
                    <Paragraph className="text-gray-600">{product.material || '100% Cotton'}</Paragraph>
                  </div>
                  <div>
                    <Paragraph className="font-medium text-gray-900">Fit</Paragraph>
                    <Paragraph className="text-gray-600">{product.fit || 'Regular Fit'}</Paragraph>
                  </div>
                  <div>
                    <Paragraph className="font-medium text-gray-900">Type</Paragraph>
                    <Paragraph className="text-gray-600">{product.type || 'Casual'}</Paragraph>
                  </div>
                  <div>
                    <Paragraph className="font-medium text-gray-900">Care</Paragraph>
                    <Paragraph className="text-gray-600">{product.care || 'Machine Wash'}</Paragraph>
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <Paragraph className="text-gray-600 text-sm">
                    {product.additionalInfo || '• Model is 6\'0" wearing size M • Premium quality materials • Sustainable production'}
                  </Paragraph>
                </div>
              </div>
            </details>

            <details className="group product-detail-section p-4">
              <summary className="flex items-center justify-between cursor-pointer font-semibold">
                Size Guide
                <ApperIcon name="ChevronDown" size={16} className="group-open:rotate-180 transition-transform" />
              </summary>
              <div className="mt-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Size</th>
                        <th className="text-left py-2">Chest (inches)</th>
                        <th className="text-left py-2">Length (inches)</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-600">
                      <tr className="border-b"><td className="py-1">S</td><td>36-38</td><td>27</td></tr>
                      <tr className="border-b"><td className="py-1">M</td><td>38-40</td><td>28</td></tr>
                      <tr className="border-b"><td className="py-1">L</td><td>40-42</td><td>29</td></tr>
                      <tr><td className="py-1">XL</td><td>42-44</td><td>30</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </details>

            <details className="group product-detail-section p-4">
              <summary className="flex items-center justify-between cursor-pointer font-semibold">
                Customer Reviews
                <ApperIcon name="ChevronDown" size={16} className="group-open:rotate-180 transition-transform" />
              </summary>
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">{product.rating || 4.5}</span>
                    <div className="star-rating">
                      {[...Array(5)].map((_, i) => (
                        <ApperIcon
                          key={i}
                          name="Star"
                          size={16}
                          className={i < Math.floor(product.rating || 4.5) ? 'star-filled' : 'star-empty'}
                          fill={i < Math.floor(product.rating || 4.5) ? 'currentColor' : 'none'}
                        />
                      ))}
                    </div>
                  </div>
                  <Paragraph className="text-gray-600 text-sm">{product.reviewCount || 128} reviews</Paragraph>
                </div>
                
                <div className="space-y-3">
                  {(product.reviews || [
                    { name: 'Sarah M.', rating: 5, comment: 'Perfect fit and great quality! Love the material.', date: '2 weeks ago' },
                    { name: 'Mike R.', rating: 4, comment: 'Good product, fast delivery. Sizing is accurate.', date: '1 month ago' }
                  ]).slice(0, 2).map((review, index) => (
                    <div key={index} className="border-b pb-3 last:border-b-0">
                      <div className="flex items-center justify-between mb-1">
                        <Paragraph className="font-medium text-sm">{review.name}</Paragraph>
                        <Paragraph className="text-gray-500 text-xs">{review.date}</Paragraph>
                      </div>
                      <div className="star-rating mb-2">
                        {[...Array(5)].map((_, i) => (
                          <ApperIcon
                            key={i}
                            name="Star"
                            size={12}
                            className={i < review.rating ? 'star-filled' : 'star-empty'}
                            fill={i < review.rating ? 'currentColor' : 'none'}
                          />
                        ))}
                      </div>
                      <Paragraph className="text-gray-600 text-sm">{review.comment}</Paragraph>
                    </div>
                  ))}
                </div>
              </div>
            </details>

            <details className="group product-detail-section p-4">
              <summary className="flex items-center justify-between cursor-pointer font-semibold">
                Shipping & Returns
                <ApperIcon name="ChevronDown" size={16} className="group-open:rotate-180 transition-transform" />
              </summary>
              <div className="mt-4 space-y-3">
                <div className="flex items-start gap-3">
                  <ApperIcon name="Truck" size={16} className="text-green-600 mt-0.5" />
                  <div>
                    <Paragraph className="font-medium">Free Shipping</Paragraph>
                    <Paragraph className="text-gray-600 text-sm">On orders over $100</Paragraph>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ApperIcon name="RotateCcw" size={16} className="text-blue-600 mt-0.5" />
                  <div>
                    <Paragraph className="font-medium">30-Day Returns</Paragraph>
                    <Paragraph className="text-gray-600 text-sm">Easy returns and exchanges</Paragraph>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ApperIcon name="Zap" size={16} className="text-orange-600 mt-0.5" />
                  <div>
                    <Paragraph className="font-medium">Express Delivery</Paragraph>
                    <Paragraph className="text-gray-600 text-sm">Next-day delivery available</Paragraph>
                  </div>
                </div>
              </div>
            </details>
          </motion.div>
</div>
      </div>

      {/* Image Zoom Modal */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="image-zoom-overlay"
            onClick={() => setIsZoomed(false)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-4xl max-h-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={displayImages[selectedImage] || product.images[0]}
                alt={product.name}
                className="image-zoom-content"
              />
              <Button
                onClick={() => setIsZoomed(false)}
                className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full"
              >
                <ApperIcon name="X" size={20} />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProductDetailMain;