import React from 'react';
import { motion } from 'framer-motion';
import ProductCard from '@/components/molecules/ProductCard';
import Heading from '@/components/atoms/Heading';

const RelatedProductsSection = ({ products }) => {
  if (products.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="mt-20"
    >
      <Heading as="h2" className="text-display-sm mb-8 text-center font-display">You might also like</Heading>
      <div className="product-grid">
        {products.map((relatedProduct, index) => (
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
  );
};

export default RelatedProductsSection;