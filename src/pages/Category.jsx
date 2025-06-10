import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { productService } from '../services';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import SkeletonLoader from '../components/SkeletonLoader';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import ApperIcon from '../components/ApperIcon';

const Category = () => {
  const { categorySlug } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    sizes: [],
    colors: [],
    priceRange: [0, 500]
  });
  const [sortBy, setSortBy] = useState('name');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const allProducts = await productService.getAll();
        const categoryProducts = categorySlug === 'all' 
          ? allProducts
          : allProducts.filter(p => p.category.toLowerCase() === categorySlug.toLowerCase());
        setProducts(categoryProducts);
        setFilteredProducts(categoryProducts);
      } catch (err) {
        setError(err.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [categorySlug]);

  useEffect(() => {
    let filtered = [...products];

    // Apply filters
    if (filters.sizes.length > 0) {
      filtered = filtered.filter(product =>
        product.sizes.some(size => filters.sizes.includes(size))
      );
    }

    if (filters.colors.length > 0) {
      filtered = filtered.filter(product =>
        product.colors.some(color => filters.colors.includes(color))
      );
    }

    filtered = filtered.filter(product =>
      product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    );

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
  }, [products, filters, sortBy]);

  const categoryName = categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/4">
            <div className="bg-white p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
          <div className="lg:w-3/4">
            <SkeletonLoader count={8} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Category Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="font-display text-display-md mb-4">{categoryName}</h1>
            <p className="text-gray-600">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:w-1/4">
            <FilterSidebar
              filters={filters}
              onFiltersChange={setFilters}
              products={products}
            />
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Mobile Filter & Sort Bar */}
            <div className="flex items-center justify-between mb-6 lg:hidden">
              <button
                onClick={() => setIsFilterOpen(true)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg"
              >
                <ApperIcon name="Filter" size={16} />
                <span>Filters</span>
              </button>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            {/* Desktop Sort & View Controls */}
            <div className="hidden lg:flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="name">Sort by Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 border rounded ${
                    viewMode === 'grid' ? 'bg-primary text-white' : 'border-gray-300'
                  }`}
                >
                  <ApperIcon name="Grid3X3" size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 border rounded ${
                    viewMode === 'list' ? 'bg-primary text-white' : 'border-gray-300'
                  }`}
                >
                  <ApperIcon name="List" size={16} />
                </button>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <EmptyState
                title="No products found"
                description="Try adjusting your filters to see more results"
                actionLabel="Clear Filters"
                onAction={() => setFilters({ sizes: [], colors: [], priceRange: [0, 500] })}
              />
            ) : (
              <div className={viewMode === 'grid' ? 'product-grid' : 'space-y-4'}>
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <ProductCard product={product} viewMode={viewMode} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Overlay */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsFilterOpen(false)}></div>
          <div className="absolute right-0 top-0 h-full w-80 bg-white overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Filters</h3>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </div>
            </div>
            <div className="p-4">
              <FilterSidebar
                filters={filters}
                onFiltersChange={setFilters}
                products={products}
                onClose={() => setIsFilterOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Category;