import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { cartService, productService } from '@/services';
import CartItemCard from '@/components/organisms/CartItemCard';
import OrderSummaryBreakdown from '@/components/molecules/OrderSummaryBreakdown';
import EmptyState from '@/components/organisms/EmptyState';
import SkeletonLoader from '@/components/organisms/SkeletonLoader';
import Heading from '@/components/atoms/Heading';
import Paragraph from '@/components/atoms/Paragraph';
import Button from '@/components/atoms/Button';

const CartOverview = () => {
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

  const subtotal = calculateSubtotal();
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

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
          actionLink="/category/all"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Heading as="h1" className="text-display-md mb-2 font-display">Shopping Cart</Heading>
          <Paragraph className="text-gray-600">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</Paragraph>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, index) => {
              const product = products[item.productId];
              if (!product) return null;

              return (
                <motion.div
                  key={item.id}
                  transition={{ delay: index * 0.1 }}
                >
                  <CartItemCard 
                    item={item} 
                    product={product} 
                    updateQuantity={updateQuantity} 
                    removeItem={removeItem} 
                    updating={updating} 
                  />
                </motion.div>
              );
            })}
          </div>

          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-24"
            >
              <Heading as="h2" className="font-semibold text-lg mb-4">Order Summary</Heading>
              
              <OrderSummaryBreakdown subtotal={subtotal} shipping={shipping} tax={tax} total={total} />

              {subtotal < 100 && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <Paragraph className="text-sm text-blue-700">
                    Add ${(100 - subtotal).toFixed(2)} more for free shipping!
                  </Paragraph>
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

export default CartOverview;