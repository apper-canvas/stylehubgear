import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import SectionHeader from '@/components/molecules/SectionHeader';
import ProductCard from '@/components/molecules/ProductCard';
import SkeletonLoader from '@/components/organisms/SkeletonLoader';
import ErrorState from '@/components/organisms/ErrorState';
import Button from '@/components/atoms/Button';

const FeaturedProductsSection = ({ products, loading, error, onRetry }) => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Featured Products"
          description="Hand-picked pieces that embody style, quality, and innovation."
        />

        {loading && <SkeletonLoader count={8} />}

        {error && (
          <ErrorState
            message={error}
            onRetry={onRetry}
          />
        )}

        {!loading && !error && products.length > 0 && (
          <div className="product-grid">
            {products.map((product, index) => (
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
  );
};

export default FeaturedProductsSection;