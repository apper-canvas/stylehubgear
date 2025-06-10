import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { productService, cartService } from '../services';
import ApperIcon from '../components/ApperIcon';
import ProductCard from '../components/ProductCard';
import SkeletonLoader from '../components/SkeletonLoader';
import ErrorState from '../components/ErrorState';

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const productData = await productService.getById(productId);
        if (!productData) {
          throw new Error('Product not found');
        }
        setProduct(productData);
        
        // Set default selections
        if (productData.sizes?.length > 0) setSelectedSize(productData.sizes[0]);
        if (productData.colors?.length > 0) setSelectedColor(productData.colors[0]);

        // Load related products
        const allProducts = await productService.getAll();
        const related = allProducts
          .filter(p => p.id !== productId && p.category === productData.category)
          .slice(0, 4);
        setRelatedProducts(related);
      } catch (err) {
        setError(err.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [productId]);

  const handleAddToCart = async () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }

    setAddingToCart(true);
    try {
      const cartItem = {
        productId: product.id,
        quantity,
        size: selectedSize,
        color: selectedColor,
        price: product.price
      };

      await cartService.create(cartItem);
      toast.success('Added to cart!');
    } catch (err) {
      toast.error('Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="aspect-square bg-gray-200 animate-pulse rounded-lg"></div>
            <div className="grid grid-cols-4 gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-square bg-gray-200 animate-pulse rounded"></div>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="h-8 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-6 bg-gray-200 animate-pulse rounded w-1/4"></div>
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 animate-pulse rounded"></div>
              ))}
            </div>
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

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Product not found</h1>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-accent hover:underline"
        >
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <nav className="text-sm text-gray-500">
          <button onClick={() => navigate(-1)} className="hover:text-primary">
            ← Back
          </button>
        </nav>
      </div>

      <div className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="aspect-square bg-gray-100 rounded-lg overflow-hidden"
            >
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Thumbnail Grid */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? 'border-accent' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-3xl font-bold text-primary mb-2">{product.name}</h1>
              <p className="text-2xl font-semibold text-accent">${product.price}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </motion.div>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="font-semibold mb-3">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded transition-colors ${
                        selectedSize === size
                          ? 'border-accent bg-accent text-white'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="font-semibold mb-3">Color</h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border rounded transition-colors capitalize ${
                        selectedColor === color
                          ? 'border-accent bg-accent text-white'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Quantity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="font-semibold mb-3">Quantity</h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-gray-300 rounded flex items-center justify-center hover:border-gray-400 transition-colors"
                >
                  <ApperIcon name="Minus" size={16} />
                </button>
                <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border border-gray-300 rounded flex items-center justify-center hover:border-gray-400 transition-colors"
                >
                  <ApperIcon name="Plus" size={16} />
                </button>
              </div>
            </motion.div>

            {/* Add to Cart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-4"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                disabled={addingToCart || !product.inStock}
                className={`w-full py-4 px-6 font-semibold rounded transition-colors ${
                  product.inStock
                    ? 'bg-accent text-white hover:bg-accent/90'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {addingToCart ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Adding to Cart...</span>
                  </div>
                ) : !product.inStock ? (
                  'Out of Stock'
                ) : (
                  'Add to Cart'
                )}
              </motion.button>

              <button className="w-full py-4 px-6 border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold rounded transition-colors">
                Add to Wishlist
              </button>
            </motion.div>

            {/* Product Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="border-t pt-6 space-y-4"
            >
              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer font-semibold">
                  Product Details
                  <ApperIcon name="ChevronDown" size={16} className="group-open:rotate-180 transition-transform" />
                </summary>
                <div className="mt-3 text-gray-600 text-sm space-y-2">
                  <p>• Premium quality materials</p>
                  <p>• Machine washable</p>
                  <p>• Regular fit</p>
                  <p>• Model is 6'0" wearing size M</p>
                </div>
              </details>

              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer font-semibold">
                  Shipping & Returns
                  <ApperIcon name="ChevronDown" size={16} className="group-open:rotate-180 transition-transform" />
                </summary>
                <div className="mt-3 text-gray-600 text-sm space-y-2">
                  <p>• Free shipping on orders over $100</p>
                  <p>• 30-day return policy</p>
                  <p>• Express delivery available</p>
                </div>
              </details>
            </motion.div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-20"
          >
            <h2 className="font-display text-display-sm mb-8 text-center">You might also like</h2>
            <div className="product-grid">
              {relatedProducts.map((relatedProduct, index) => (
                <motion.div
                  key={relatedProduct.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <ProductCard product={relatedProduct} />
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;