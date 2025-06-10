import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';
import Paragraph from '@/components/atoms/Paragraph';
import Button from '@/components/atoms/Button';

const ErrorState = ({ message, onRetry }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-16"
    >
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <ApperIcon name="AlertTriangle" size={64} className="text-error mx-auto mb-4" />
        </motion.div>
        
        <Heading as="h3" className="text-xl font-semibold text-gray-900 mb-2">Oops! Something went wrong</Heading>
        <Paragraph className="text-gray-500 mb-6">{message}</Paragraph>
        
        {onRetry && (
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={onRetry}
              className="bg-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-accent/90 transition-colors"
            >
              Try Again
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ErrorState;