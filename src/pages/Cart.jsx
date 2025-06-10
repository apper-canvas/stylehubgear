import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { cartService, productService } from '../services';
import ApperIcon from '../components/ApperIcon';
import EmptyState from '../components/EmptyState';
import SkeletonLoader from '../components/SkeletonLoader';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState({});

  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);
      try {
        const items = await cartService.getAll();
        setCartItems(items);

        // Load product details for each cart item
        const productIds = [...new Set(items.map(item => item.productId))];
        const productPromises = productIds.map(id => productService.getById(id));
        const productResults = await Promise.all(productPromises);
        
        const productsMap = {};
        productResults.forEach(product => {
          if (product) productsMap[product.id] = product;
        });
        setProducts(productsMap);
      } catch (error) {
        toast.error('Failed to load cart');
      } finally {
        setLoading(false);
      }
    };
    loadCart();
  }, []);

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setUpdating(prev => ({ ...prev, [itemId]: true }));
    try {
      const updatedItem = await cartService.update(itemId, { quantity: newQuantity });
      setCartItems(items => 
        items.map(item => item.id === itemId ? updatedItem : item)
      );
    } catch (error) {
      toast.error('Failed to update quantity');
    } finally {
      setUpdating(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const removeItem = async (itemId) => {
    try {
      await cartService.delete(itemId);
      setCartItems(items => items.filter(item => item.id !== itemId));
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const shipping = subtotal > 100 ? 0 : 10;
    const tax = subtotal * 0.08;
    return subtotal + shipping + tax;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <SkeletonLoader count={3} />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <EmptyState
          title="Your cart is empty"
          description="Looks like you haven't added anything to your cart yet."
          actionLabel="Start Shopping"
          onAction={() => {}}
          actionLink="/category/all"
        />
      </div>
    );
  }

  const subtotal = calculateSubtotal();
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.08;
  const total = calculateTotal();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-display-md mb-2">Shopping Cart</h1>
          <p className="text-gray-600">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, index) => {
              const product = products[item.productId];
              if (!product) return null;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Product Image */}
                    <div className="w-full sm:w-24 h-48 sm:h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-primary break-words">{product.name}</h3>
                      <div className="text-sm text-gray-500 mt-1">
                        {item.size && <span>Size: {item.size}</span>}
                        {item.size && item.color && <span className="mx-2">•</span>}
                        {item.color && <span className="capitalize">Color: {item.color}</span>}
                      </div>
                      <p className="font-semibold text-accent mt-2">${item.price}</p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between sm:justify-end sm:flex-col sm:items-end space-y-2">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={updating[item.id] || item.quantity <= 1}
                          className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:border-gray-400 transition-colors disabled:opacity-50"
                        >
                          <ApperIcon name="Minus" size={14} />
                        </button>
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={updating[item.id]}
                          className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:border-gray-400 transition-colors disabled:opacity-50"
                        >
                          <ApperIcon name="Plus" size={14} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <ApperIcon name="Trash2" size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-24"
            >
              <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {subtotal < 100 && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700">
                    Add ${(100 - subtotal).toFixed(2)} more for free shipping!
                  </p>
                </div>
              )}

              <NavLink
                to="/checkout"
                className="block w-full mt-6 bg-accent text-white text-center py-3 font-semibold rounded-lg hover:bg-accent/90 transition-colors"
              >
                Proceed to Checkout
              </NavLink>

              <NavLink
                to="/category/all"
                className="block w-full mt-3 border-2 border-primary text-primary text-center py-3 font-semibold rounded-lg hover:bg-primary hover:text-white transition-colors"
              >
                Continue Shopping
              </NavLink>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;