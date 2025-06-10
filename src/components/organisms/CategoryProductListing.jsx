import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { productService } from '@/services';
import ProductCard from '@/components/molecules/ProductCard';
import FilterSidebar from '@/components/organisms/FilterSidebar';
import SkeletonLoader from '@/components/organisms/SkeletonLoader';
import ErrorState from '@/components/organisms/ErrorState';
import EmptyState from '@/components/organisms/EmptyState';
import ApperIcon from '@/components/ApperIcon';
import Select from '@/components/atoms/Select';
import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Heading';
import Paragraph from '@/components/atoms/Paragraph';
import ViewModeToggle from '@/components/molecules/ViewModeToggle';

const CategoryProductListing = () => {
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
  const [viewMode, setViewMode] = useState('grid'); // Default view mode

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
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="hidden lg:block lg:w-1/4">
            <FilterSidebar
              filters={filters}
              onFiltersChange={setFilters}
              products={products}
            />
          </div>

          <div className="lg:w-3/4">
            <div className="flex items-center justify-between mb-6 lg:hidden">
              <Button
                onClick={() => setIsFilterOpen(true)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg"
              >
                <ApperIcon name="Filter" size={16} />
                <span>Filters</span>
              </Button>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </Select>
            </div>

<div className="hidden lg:flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}
                </span>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="name">Sort by Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </Select>
              </div>
              <ViewModeToggle viewMode={viewMode} onToggle={setViewMode} />
            </div>

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

      {isFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsFilterOpen(false)}></div>
          <div className="absolute right-0 top-0 h-full w-80 bg-white overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <Heading as="h3" className="text-lg font-semibold">Filters</Heading>
                <Button
                  onClick={() => setIsFilterOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <ApperIcon name="X" size={20} />
                </Button>
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

export default CategoryProductListing;