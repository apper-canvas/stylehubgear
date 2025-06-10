import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { productService } from '../services';
import ApperIcon from './ApperIcon';

const CartSidebar = ({ isOpen, onClose, items, setItems }) => {
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && items.length > 0) {
      const loadProducts = async () => {
        setLoading(true);
        try {
          const productIds = [...new Set(items.map(item => item.productId))];
          const productPromises = productIds.map(id => productService.getById(id));
          const productResults = await Promise.all(productPromises);
          
          const productsMap = {};
          productResults.forEach(product => {
            if (product) productsMap[product.id] = product;
          });
          setProducts(productsMap);
        } catch (error) {
          console.error('Failed to load products:', error);
        } finally {
          setLoading(false);
        }
      };
      loadProducts();
    }
  }, [isOpen, items]);

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    setItems(items.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeItem = (itemId) => {
    setItems(items.filter(item => item.id !== itemId));
    toast.success('Item removed from cart');
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: isOpen ? 0 : '100%' }}
        transition={{ type: 'tween', duration: 0.3 }}
        className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50 flex flex-col max-w-full"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Shopping Cart</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ApperIcon name="X" size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-6 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex space-x-3">
                    <div className="w-16 h-16 bg-gray-200 rounded"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="p-6 text-center">
              <ApperIcon name="ShoppingCart" size={48} className="text-gray-300 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-gray-500 text-sm mb-4">
                Add some items to get started
              </p>
              <NavLink
                to="/category/all"
                onClick={onClose}
                className="inline-block bg-accent text-white px-4 py-2 rounded-lg font-semibold hover:bg-accent/90 transition-colors"
              >
                Start Shopping
              </NavLink>
            </div>
          ) : (
            <div className="p-6 space-y-4">
              {items.map((item) => {
                const product = products[item.productId];
                if (!product) return null;

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex space-x-3 pb-4 border-b border-gray-100"
                  >
                    <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm break-words">{product.name}</h4>
                      <div className="text-xs text-gray-500 mt-1">
                        {item.size && <span>Size: {item.size}</span>}
                        {item.size && item.color && <span className="mx-1">•</span>}
                        {item.color && <span className="capitalize">Color: {item.color}</span>}
                      </div>
                      <p className="font-semibold text-accent text-sm mt-1">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="w-6 h-6 border border-gray-300 rounded flex items-center justify-center text-xs hover:border-gray-400 transition-colors disabled:opacity-50"
                          >
                            <ApperIcon name="Minus" size={12} />
                          </button>
                          <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 border border-gray-300 rounded flex items-center justify-center text-xs hover:border-gray-400 transition-colors"
                          >
                            <ApperIcon name="Plus" size={12} />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <ApperIcon name="Trash2" size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total:</span>
              <span className="font-semibold text-lg">${calculateTotal().toFixed(2)}</span>
            </div>

            <div className="space-y-2">
              <NavLink
                to="/checkout"
                onClick={onClose}
                className="block w-full bg-accent text-white text-center py-3 font-semibold rounded-lg hover:bg-accent/90 transition-colors"
              >
                Checkout
              </NavLink>
              <NavLink
                to="/cart"
                onClick={onClose}
                className="block w-full border-2 border-primary text-primary text-center py-3 font-semibold rounded-lg hover:bg-primary hover:text-white transition-colors"
              >
                View Cart
              </NavLink>
            </div>
          </div>
        )}
      </motion.div>
    </>
  );
};

export default CartSidebar;