import React from 'react';
import { motion } from 'framer-motion';

const SkeletonLoader = ({ count = 8 }) => {
  return (
    <div className="product-grid">
      {[...Array(count)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: index * 0.05 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="aspect-[4/5] bg-gray-200 animate-pulse"></div>
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4"></div>
            <div className="flex justify-between items-center">
              <div className="h-6 bg-gray-200 animate-pulse rounded w-16"></div>
              <div className="flex space-x-1">
                {[...Array(3)].map((__, i) => (
                  <div key={i} className="w-4 h-4 bg-gray-200 animate-pulse rounded-full"></div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default SkeletonLoader;