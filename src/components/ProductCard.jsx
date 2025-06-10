import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { cartService } from '../services';
import ApperIcon from './ApperIcon';

const ProductCard = ({ product, viewMode = 'grid' }) => {
  const [addingToCart, setAddingToCart] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!product.inStock) return;
    
    setAddingToCart(true);
    try {
      const cartItem = {
        productId: product.id,
        quantity: 1,
        size: product.sizes?.[0] || '',
        color: product.colors?.[0] || '',
        price: product.price
      };

      await cartService.create(cartItem);
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
      >
        <NavLink to={`/product/${product.id}`} className="flex p-4 hover:bg-gray-50 transition-colors">
          <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="ml-4 flex-1 min-w-0">
            <h3 className="font-semibold text-primary break-words">{product.name}</h3>
            <p className="text-gray-500 text-sm mt-1 line-clamp-2">{product.description}</p>
            <div className="flex items-center justify-between mt-3">
              <p className="font-semibold text-accent">${product.price}</p>
              <div className="flex items-center space-x-2">
                {product.sizes && product.sizes.length > 0 && (
                  <span className="text-xs text-gray-500">
                    Sizes: {product.sizes.join(', ')}
                  </span>
                )}
              </div>
            </div>
          </div>
        </NavLink>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-shadow duration-200 hover:shadow-lg"
    >
      <NavLink to={`/product/${product.id}`} className="block">
        <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Quick Add Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: isHovered ? 1 : 0, 
              y: isHovered ? 0 : 20 
            }}
            transition={{ duration: 0.2 }}
            onClick={handleQuickAdd}
            disabled={addingToCart || !product.inStock}
            className={`absolute bottom-4 left-4 right-4 py-2 px-4 font-semibold rounded transition-colors ${
              product.inStock
                ? 'bg-accent text-white hover:bg-accent/90'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {addingToCart ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Adding...
              </div>
            ) : !product.inStock ? (
              'Out of Stock'
            ) : (
              'Quick Add'
            )}
          </motion.button>

          {/* Sale Badge */}
          {product.featured && (
            <div className="absolute top-3 left-3 bg-accent text-white text-xs font-semibold px-2 py-1 rounded">
              Featured
            </div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toast.success('Added to wishlist!');
            }}
            className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
          >
            <ApperIcon name="Heart" size={16} className="text-gray-600 hover:text-accent transition-colors" />
          </button>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-primary break-words line-clamp-2 mb-2">
            {product.name}
          </h3>
          
          <div className="flex items-center justify-between">
            <p className="font-semibold text-accent">${product.price}</p>
            
            {/* Color Options */}
            {product.colors && product.colors.length > 0 && (
              <div className="flex space-x-1">
                {product.colors.slice(0, 3).map((color, index) => (
                  <div
                    key={index}
                    className={`w-4 h-4 rounded-full border border-gray-300 ${
                      color === 'black' ? 'bg-black' :
                      color === 'white' ? 'bg-white' :
                      color === 'blue' ? 'bg-blue-500' :
                      color === 'red' ? 'bg-red-500' :
                      color === 'green' ? 'bg-green-500' :
                      color === 'gray' ? 'bg-gray-500' :
                      'bg-gray-300'
                    }`}
                    title={color}
                  />
                ))}
                {product.colors.length > 3 && (
                  <span className="text-xs text-gray-500 ml-1">
                    +{product.colors.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mt-2">
              <p className="text-xs text-gray-500">
                Sizes: {product.sizes.join(', ')}
              </p>
            </div>
          )}
        </div>
      </NavLink>
    </motion.div>
  );
};

export default ProductCard;