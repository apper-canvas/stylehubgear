import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import Image from '@/components/atoms/Image';
import Heading from '@/components/atoms/Heading';
import Paragraph from '@/components/atoms/Paragraph';

const CategoryCard = ({ category, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <NavLink
        to={`/category/${category.slug}`}
        className="group block relative h-96 overflow-hidden bg-gray-100 transition-transform duration-300 hover:scale-105"
      >
        <Image
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <Heading as="h3" className="text-2xl mb-2">{category.name}</Heading>
          <Paragraph className="text-gray-200 text-sm">{category.description}</Paragraph>
        </div>
      </NavLink>
    </motion.div>
  );
};

export default CategoryCard;