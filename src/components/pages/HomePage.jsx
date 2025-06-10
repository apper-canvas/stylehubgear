import { useState, useEffect } from 'react';
import { productService } from '@/services';
import HeroSection from '@/components/organisms/HeroSection';
import CategoriesSection from '@/components/organisms/CategoriesSection';
import FeaturedProductsSection from '@/components/organisms/FeaturedProductsSection';
import PromotionalBanner from '@/components/organisms/PromotionalBanner';

const HomePage = () => {
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
      <HeroSection />
      <CategoriesSection categories={categories} />
      <FeaturedProductsSection 
        products={featuredProducts} 
        loading={loading} 
        error={error} 
        onRetry={() => window.location.reload()} 
      />
      <PromotionalBanner />
    </div>
  );
};

export default HomePage;