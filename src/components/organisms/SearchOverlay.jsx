import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { productService } from '@/services';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';
import Paragraph from '@/components/atoms/Paragraph';
import Button from '@/components/atoms/Button';
import SearchInput from '@/components/molecules/SearchInput';
import RecentSearchItem from '@/components/molecules/RecentSearchItem';
import SearchResultItem from '@/components/molecules/SearchResultItem';

const SearchOverlay = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
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
            <div className="p-6 border-b border-gray-200">
              <SearchInput query={query} onQueryChange={setQuery} onClose={onClose} />
            </div>

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
                  <Heading as="h3" className="text-sm font-semibold text-gray-700 mb-3">Products</Heading>
                  <div className="space-y-2">
                    {results.map((product) => (
                      <SearchResultItem
                        key={product.id}
                        product={product}
                        onClick={handleProductClick}
                      />
                    ))}
                  </div>
                </div>
              )}

              {!loading && query && results.length === 0 && (
                <div className="p-6 text-center">
                  <ApperIcon name="Search" size={48} className="text-gray-300 mx-auto mb-3" />
                  <Heading as="h3" className="font-semibold text-gray-900 mb-1">No results found</Heading>
                  <Paragraph className="text-gray-500 text-sm">
                    Try searching with different keywords
                  </Paragraph>
                </div>
              )}

              {!query && recentSearches.length > 0 && (
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <Heading as="h3" className="text-sm font-semibold text-gray-700">Recent Searches</Heading>
                    <Button
                      onClick={clearRecentSearches}
                      className="text-xs text-accent hover:underline"
                    >
                      Clear all
                    </Button>
                  </div>
                  <div className="space-y-1">
                    {recentSearches.map((search, index) => (
                      <RecentSearchItem
                        key={index}
                        searchTerm={search}
                        onClick={handleRecentSearchClick}
                      />
                    ))}
                  </div>
                </div>
              )}

              {!query && recentSearches.length === 0 && (
                <div className="p-6 text-center">
                  <ApperIcon name="Search" size={48} className="text-gray-300 mx-auto mb-3" />
                  <Heading as="h3" className="font-semibold text-gray-900 mb-1">Search StyleHub</Heading>
                  <Paragraph className="text-gray-500 text-sm">
                    Find your perfect style from our collection
                  </Paragraph>
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