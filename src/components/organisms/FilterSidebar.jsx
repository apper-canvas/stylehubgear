import { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Checkbox from '@/components/atoms/Checkbox';
import Heading from '@/components/atoms/Heading';
import Input from '@/components/atoms/Input';
import Label from '@/components/atoms/Label';
import Paragraph from '@/components/atoms/Paragraph';

const FilterSidebar = ({ filters, onFiltersChange, products, onClose }) => {
  const [openSections, setOpenSections] = useState({
    categories: true,
    sizes: true,
    colors: true,
    price: true
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const categories = [...new Set(products.map(p => p.category))].sort();
  const sizes = [...new Set(products.flatMap(p => p.sizes || []))].sort();
  const colors = [...new Set(products.flatMap(p => p.colors || []))].sort();
  
  const handleCategoryChange = (category) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    
    onFiltersChange({
      ...filters,
      categories: newCategories
    });
  };

  const handleSizeChange = (size) => {
    const newSizes = filters.sizes.includes(size)
      ? filters.sizes.filter(s => s !== size)
      : [...filters.sizes, size];
    
    onFiltersChange({
      ...filters,
      sizes: newSizes
    });
  };

  const handleColorChange = (color) => {
    const newColors = filters.colors.includes(color)
      ? filters.colors.filter(c => c !== color)
      : [...filters.colors, color];
    
    onFiltersChange({
      ...filters,
      colors: newColors
    });
  };

  const handlePriceChange = (value, index) => {
    const newPriceRange = [...filters.priceRange];
    newPriceRange[index] = parseInt(value);
    
    onFiltersChange({
      ...filters,
      priceRange: newPriceRange
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      categories: [],
      sizes: [],
      colors: [],
      priceRange: [0, 500]
    });
  };

  const hasActiveFilters = 
    filters.categories.length > 0 || 
    filters.sizes.length > 0 || 
    filters.colors.length > 0 ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 500;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <Heading as="h3" className="text-lg font-semibold">Filters</Heading>
        {hasActiveFilters && (
          <Button
            onClick={clearAllFilters}
            className="text-accent hover:underline text-sm"
          >
            Clear All
          </Button>
        )}
        {onClose && (
          <Button
            onClick={onClose}
            className="lg:hidden p-1 text-gray-400 hover:text-gray-600"
          >
            <ApperIcon name="X" size={20} />
          </Button>
        )}
      </div>

      <div className="space-y-6">
        <div>
          <Button
            onClick={() => toggleSection('categories')}
            className="flex items-center justify-between w-full py-2 font-medium text-left"
          >
            <span>Category</span>
            <ApperIcon 
              name="ChevronDown" 
              size={16} 
              className={`transform transition-transform ${
                openSections.categories ? 'rotate-180' : ''
              }`}
            />
          </Button>
          
          <motion.div
            initial={false}
            animate={{ 
              height: openSections.categories ? 'auto' : 0,
              opacity: openSections.categories ? 1 : 0
            }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="space-y-2 pt-2">
              {categories.map(category => (
                <Label key={category} className="flex items-center space-x-2 cursor-pointer">
                  <Checkbox
                    checked={filters.categories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                  />
                  <span className="text-sm capitalize">{category}</span>
                </Label>
              ))}
            </div>
          </motion.div>
        </div>

        <div>
          <Button
            onClick={() => toggleSection('sizes')}
            className="flex items-center justify-between w-full py-2 font-medium text-left"
          >
            <span>Size</span>
            <ApperIcon 
              name="ChevronDown" 
              size={16} 
              className={`transform transition-transform ${
                openSections.sizes ? 'rotate-180' : ''
              }`}
            />
          </Button>
          
          <motion.div
            initial={false}
            animate={{ 
              height: openSections.sizes ? 'auto' : 0,
              opacity: openSections.sizes ? 1 : 0
            }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-3 gap-2 pt-2">
              {sizes.map(size => (
                <Button
                  key={size}
                  onClick={() => handleSizeChange(size)}
                  className={`px-3 py-2 text-sm border rounded transition-colors ${
                    filters.sizes.includes(size)
                      ? 'border-accent bg-accent text-white'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {size}
                </Button>
              ))}
            </div>
          </motion.div>
        </div>

        <div>
          <Button
            onClick={() => toggleSection('colors')}
            className="flex items-center justify-between w-full py-2 font-medium text-left"
          >
            <span>Color</span>
            <ApperIcon 
              name="ChevronDown" 
              size={16} 
              className={`transform transition-transform ${
                openSections.colors ? 'rotate-180' : ''
              }`}
            />
          </Button>
          
          <motion.div
            initial={false}
            animate={{ 
              height: openSections.colors ? 'auto' : 0,
              opacity: openSections.colors ? 1 : 0
            }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="space-y-2 pt-2">
              {colors.map(color => (
                <Label key={color} className="flex items-center space-x-3 cursor-pointer">
                  <div className="flex items-center">
                    <Checkbox
                      checked={filters.colors.includes(color)}
                      onChange={() => handleColorChange(color)}
                    />
                    <div
                      className={`w-4 h-4 rounded-full border border-gray-300 ml-2 ${
                        color === 'black' ? 'bg-black' :
                        color === 'white' ? 'bg-white' :
                        color === 'blue' ? 'bg-blue-500' :
                        color === 'red' ? 'bg-red-500' :
                        color === 'green' ? 'bg-green-500' :
                        color === 'gray' ? 'bg-gray-500' :
                        color === 'navy' ? 'bg-blue-900' :
                        color === 'beige' ? 'bg-yellow-100' :
                        'bg-gray-300'
                      }`}
                    />
                  </div>
                  <span className="text-sm capitalize">{color}</span>
                </Label>
              ))}
            </div>
          </motion.div>
        </div>

        <div>
          <Button
            onClick={() => toggleSection('price')}
            className="flex items-center justify-between w-full py-2 font-medium text-left"
          >
            <span>Price</span>
            <ApperIcon 
              name="ChevronDown" 
              size={16} 
              className={`transform transition-transform ${
                openSections.price ? 'rotate-180' : ''
              }`}
            />
          </Button>
          
          <motion.div
            initial={false}
            animate={{ 
              height: openSections.price ? 'auto' : 0,
              opacity: openSections.price ? 1 : 0
            }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="space-y-4 pt-2">
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  value={filters.priceRange[0]}
                  onChange={(e) => handlePriceChange(e.target.value, 0)}
                  placeholder="Min"
                  className="px-3 py-2 text-sm"
                  min="0"
                  max="500"
                />
                <span className="text-gray-500">to</span>
                <Input
                  type="number"
                  value={filters.priceRange[1]}
                  onChange={(e) => handlePriceChange(e.target.value, 1)}
                  placeholder="Max"
                  className="px-3 py-2 text-sm"
                  min="0"
                  max="500"
                />
              </div>
              
              <Paragraph className="text-center text-sm text-gray-500">
                ${filters.priceRange[0]} - ${filters.priceRange[1]}
              </Paragraph>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;