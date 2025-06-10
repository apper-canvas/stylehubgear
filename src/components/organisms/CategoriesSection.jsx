import React from 'react';
import SectionHeader from '@/components/molecules/SectionHeader';
import CategoryCard from '@/components/molecules/CategoryCard';

const CategoriesSection = ({ categories }) => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Shop by Category"
          description="Explore our carefully curated collections designed for every lifestyle and occasion."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <CategoryCard key={category.slug} category={category} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;