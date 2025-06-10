import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import Heading from '@/components/atoms/Heading';
import Paragraph from '@/components/atoms/Paragraph';
import Button from '@/components/atoms/Button';

const HeroSection = () => {
  return (
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
          <Heading as="h1" className="text-display-lg md:text-7xl mb-6 font-display">
            Fashion Forward
          </Heading>
          <Paragraph className="text-xl mb-8 text-gray-200">
            Discover the latest trends and timeless pieces that define your style.
          </Paragraph>
          <NavLink
            to="/category/new-arrivals"
            className="inline-block bg-accent hover:bg-accent/90 text-white px-8 py-4 font-semibold transition-all duration-200 hover:scale-105"
          >
            Shop New Arrivals
          </NavLink>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;