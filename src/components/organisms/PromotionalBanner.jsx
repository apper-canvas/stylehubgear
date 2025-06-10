import React from 'react';
import { motion } from 'framer-motion';
import Heading from '@/components/atoms/Heading';
import Paragraph from '@/components/atoms/Paragraph';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';

const PromotionalBanner = () => {
  return (
    <section className="py-16 bg-accent text-white">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Heading as="h2" className="text-display-md mb-4">
            Get 20% Off Your First Order
          </Heading>
          <Paragraph className="text-xl mb-8 text-pink-100">
            Sign up for our newsletter and stay updated with the latest trends.
          </Paragraph>
          <div className="max-w-md mx-auto flex">
            <Input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 text-gray-900 placeholder-gray-500"
            />
            <Button className="bg-primary text-white px-6 py-3 font-semibold hover:bg-gray-800 transition-colors">
              Subscribe
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PromotionalBanner;