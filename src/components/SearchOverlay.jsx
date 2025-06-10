import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { productService } from '../services';
import ApperIcon from './ApperIcon';

const SearchOverlay = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    const searchProducts = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const products = await productService.getAll();
        const filtered = products.filter(product =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.description.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 6);
        setResults(filtered);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(searchProducts, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const saveSearch = (searchQuery) => {
    if (!searchQuery.trim()) return;
    
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const handleProductClick = () => {
    saveSearch(query);
    onClose();
  };

  const handleRecentSearchClick = (searchTerm) => {
    setQuery(searchTerm);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white m-4 md:m-8 lg:mx-auto lg:max-w-2xl lg:mt-20 rounded-lg shadow-xl overflow-hidden"
          >
            {/* Search Input */}
            <div className="p-6 border-b border-gray-200">
              <div className="relative">
                <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for products..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
                  autoFocus
                />
                <button
                  onClick={onClose}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </div>
            </div>

            {/* Search Results */}
            <div className="max-h-96 overflow-y-auto">
              {loading && (
                <div className="p-6">
                  <div className="animate-pulse space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex space-x-3">
                        <div className="w-12 h-12 bg-gray-200 rounded"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!loading && query && results.length > 0 && (
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Products</h3>
                  <div className="space-y-2">
                    {results.map((product) => (
                      <NavLink
                        key={product.id}
                        to={`/product/${product.id}`}
                        onClick={handleProductClick}
                        className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 break-words">{product.name}</h4>
                          <p className="text-sm text-accent font-semibold">${product.price}</p>
                        </div>
                      </NavLink>
                    ))}
                  </div>
                </div>
              )}

              {!loading && query && results.length === 0 && (
                <div className="p-6 text-center">
                  <ApperIcon name="Search" size={48} className="text-gray-300 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-1">No results found</h3>
                  <p className="text-gray-500 text-sm">
                    Try searching with different keywords
                  </p>
                </div>
              )}

              {!query && recentSearches.length > 0 && (
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-700">Recent Searches</h3>
                    <button
                      onClick={clearRecentSearches}
                      className="text-xs text-accent hover:underline"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="space-y-1">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleRecentSearchClick(search)}
                        className="flex items-center space-x-2 w-full p-2 text-left hover:bg-gray-50 rounded transition-colors"
                      >
                        <ApperIcon name="Clock" size={16} className="text-gray-400" />
                        <span className="text-sm text-gray-700">{search}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {!query && recentSearches.length === 0 && (
                <div className="p-6 text-center">
                  <ApperIcon name="Search" size={48} className="text-gray-300 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-1">Search StyleHub</h3>
                  <p className="text-gray-500 text-sm">
                    Find your perfect style from our collection
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchOverlay;