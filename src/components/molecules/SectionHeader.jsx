import React from 'react';
import { motion } from 'framer-motion';
import Heading from '@/components/atoms/Heading';
import Paragraph from '@/components/atoms/Paragraph';

const SectionHeader = ({ title, description, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`text-center mb-12 ${className}`}
    >
      <Heading as="h2" className="text-display-md mb-4">{title}</Heading>
      <Paragraph className="text-gray-600 max-w-2xl mx-auto">
        {description}
      </Paragraph>
    </motion.div>
  );
};

export default SectionHeader;