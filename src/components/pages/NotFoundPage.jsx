import React from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';
import Paragraph from '@/components/atoms/Paragraph';
import Button from '@/components/atoms/Button';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <ApperIcon name="AlertCircle" size={64} className="text-gray-300 mx-auto mb-4" />
            <Heading as="h1" className="font-display text-display-lg text-primary mb-4">404</Heading>
            <Heading as="h2" className="text-2xl font-semibold text-gray-700 mb-2">Page Not Found</Heading>
            <Paragraph className="text-gray-500 max-w-md mx-auto">
              The page you're looking for doesn't exist or has been moved.
            </Paragraph>
          </div>

          <div className="space-y-4">
            <NavLink
              to="/home"
              className="inline-block bg-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-accent/90 transition-colors"
            >
              Go Home
            </NavLink>
            <div>
              <Button
                onClick={() => window.history.back()}
                className="text-gray-500 hover:text-primary transition-colors"
              >
                ← Go Back
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage;