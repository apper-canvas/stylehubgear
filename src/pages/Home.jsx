import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { productService } from '../services';
import ProductCard from '../components/ProductCard';
import SkeletonLoader from '../components/SkeletonLoader';
import ErrorState from '../components/ErrorState';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const products = await productService.getAll();
        setFeaturedProducts(products.filter(p => p.featured).slice(0, 8));
      } catch (err) {
        setError(err.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    loadFeaturedProducts();
  }, []);

  const categories = [
    {
      name: 'Men',
      slug: 'men',
      image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=600&h=800&fit=crop&crop=face',
      description: 'Modern essentials for the contemporary man'
    },
    {
      name: 'Women',
      slug: 'women',
      image: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=600&h=800&fit=crop&crop=face',
      description: 'Elegant styles for every occasion'
    },
    {
      name: 'Kids',
      slug: 'kids',
      image: 'https://images.unsplash.com/photo-1519340333755-56e9c1d4f786?w=600&h=800&fit=crop&crop=face',
      description: 'Comfortable and playful designs'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] bg-gradient-to-br from-gray-900 to-gray-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&h=1000&fit=crop)'
          }}
        ></div>
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="font-display text-display-lg md:text-7xl mb-6">
              Fashion Forward
            </h1>
            <p className="text-xl mb-8 text-gray-200">
              Discover the latest trends and timeless pieces that define your style.
            </p>
            <NavLink
              to="/category/new-arrivals"
              className="inline-block bg-accent hover:bg-accent/90 text-white px-8 py-4 font-semibold transition-all duration-200 hover:scale-105"
            >
              Shop New Arrivals
            </NavLink>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-display-md mb-4">Shop by Category</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our carefully curated collections designed for every lifestyle and occasion.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <NavLink
                  to={`/category/${category.slug}`}
                  className="group block relative h-96 overflow-hidden bg-gray-100 transition-transform duration-300 hover:scale-105"
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="font-display text-2xl mb-2">{category.name}</h3>
                    <p className="text-gray-200 text-sm">{category.description}</p>
                  </div>
                </NavLink>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-display-md mb-4">Featured Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hand-picked pieces that embody style, quality, and innovation.
            </p>
          </motion.div>

          {loading && <SkeletonLoader count={8} />}

          {error && (
            <ErrorState
              message={error}
              onRetry={() => window.location.reload()}
            />
          )}

          {!loading && !error && featuredProducts.length > 0 && (
            <div className="product-grid">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <NavLink
              to="/category/all"
              className="inline-block border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 font-semibold transition-all duration-200"
            >
              View All Products
            </NavLink>
          </div>
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="py-16 bg-accent text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-display-md mb-4">
              Get 20% Off Your First Order
            </h2>
            <p className="text-xl mb-8 text-pink-100">
              Sign up for our newsletter and stay updated with the latest trends.
            </p>
            <div className="max-w-md mx-auto flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 text-gray-900 placeholder-gray-500"
              />
              <button className="bg-primary text-white px-6 py-3 font-semibold hover:bg-gray-800 transition-colors">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;