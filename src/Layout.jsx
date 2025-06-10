import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import CartSidebar from '@/components/organisms/CartSidebar';
import SearchOverlay from '@/components/organisms/SearchOverlay';
import { cartService } from '@/services';

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const loadCart = async () => {
      try {
        const items = await cartService.getAll();
        setCartItems(items);
      } catch (error) {
        console.error('Failed to load cart:', error);
      }
    };
    loadCart();
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const navigationItems = [
    { name: 'Shop', path: '/home' },
    { name: 'Men', path: '/category/men' },
    { name: 'Women', path: '/category/women' },
    { name: 'Kids', path: '/category/kids' },
    { name: 'Sale', path: '/category/sale' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 backdrop-blur-md bg-white/95">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-gray-600 hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <ApperIcon name={isMobileMenuOpen ? 'X' : 'Menu'} size={24} />
            </button>

            {/* Logo */}
            <NavLink to="/home" className="font-display text-display-sm text-primary">
              StyleHub
            </NavLink>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors hover:text-accent ${
                      isActive ? 'text-accent' : 'text-gray-700'
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-gray-600 hover:text-primary transition-colors"
              >
                <ApperIcon name="Search" size={20} />
              </button>

              {/* Account */}
              <button className="hidden sm:block p-2 text-gray-600 hover:text-primary transition-colors">
                <ApperIcon name="User" size={20} />
              </button>

              {/* Cart */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-gray-600 hover:text-primary transition-colors"
              >
                <ApperIcon name="ShoppingCart" size={20} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="lg:hidden overflow-hidden border-t border-gray-200 bg-white"
            >
              <nav className="py-4 px-4 space-y-2">
                {navigationItems.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    className={({ isActive }) =>
                      `block py-2 px-3 text-base font-medium rounded-lg transition-colors ${
                        isActive
                          ? 'bg-accent text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                ))}
                <div className="pt-2 border-t border-gray-200 mt-4">
                  <button className="flex items-center space-x-3 py-2 px-3 text-gray-700 hover:bg-gray-100 rounded-lg w-full">
                    <ApperIcon name="User" size={20} />
                    <span>Account</span>
                  </button>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-primary text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-display text-xl mb-4">StyleHub</h3>
              <p className="text-gray-300 text-sm">
                Fashion forward clothing for the modern lifestyle.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Shop</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Men</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Women</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Kids</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Sale</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Size Guide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Returns</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Shipping</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Follow</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <ApperIcon name="Instagram" size={20} />
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <ApperIcon name="Twitter" size={20} />
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <ApperIcon name="Facebook" size={20} />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-300">
            <p>&copy; 2024 StyleHub. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Overlays */}
      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        setItems={setCartItems}
      />
      
      <SearchOverlay 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </div>
  );
};

export default Layout;