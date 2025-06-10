import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { productService } from '@/services';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Heading';
import Paragraph from '@/components/atoms/Paragraph';
import Image from '@/components/atoms/Image';
import QuantitySelector from '@/components/molecules/QuantitySelector';
import OrderSummaryBreakdown from '@/components/molecules/OrderSummaryBreakdown';
import EmptyState from '@/components/organisms/EmptyState'; // Use EmptyState organism

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

  const calculateSubtotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const subtotal = calculateSubtotal();
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <>
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

      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: isOpen ? 0 : '100%' }}
        transition={{ type: 'tween', duration: 0.3 }}
        className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50 flex flex-col max-w-full"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <Heading as="h2" className="text-lg font-semibold">Shopping Cart</Heading>
          <Button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ApperIcon name="X" size={20} />
          </Button>
        </div>

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
            <EmptyState
              title="Your cart is empty"
              description="Add some items to get started"
              actionLabel="Start Shopping"
              onAction={onClose} // Close sidebar when navigating
              actionLink="/category/all"
            />
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
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <Heading as="h4" className="font-medium text-sm break-words">{product.name}</Heading>
                      <Paragraph className="text-xs text-gray-500 mt-1">
                        {item.size && <span>Size: {item.size}</span>}
                        {item.size && item.color && <span className="mx-1">•</span>}
                        {item.color && <span className="capitalize">Color: {item.color}</span>}
                      </Paragraph>
                      <Paragraph className="font-semibold text-accent text-sm mt-1">
                        ${(item.price * item.quantity).toFixed(2)}
                      </Paragraph>

                      <div className="flex items-center justify-between mt-2">
                        <QuantitySelector
                          quantity={item.quantity}
                          onDecrease={() => updateQuantity(item.id, item.quantity - 1)}
                          onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
                          className="space-x-1" // Smaller spacing for sidebar
                        />
                        <Button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <ApperIcon name="Trash2" size={14} />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-gray-200 p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total:</span>
              <span className="font-semibold text-lg">${total.toFixed(2)}</span>
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