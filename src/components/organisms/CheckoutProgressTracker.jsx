import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Paragraph from '@/components/atoms/Paragraph';

const CheckoutProgressTracker = ({ currentStep, steps }) => {
  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
              currentStep >= step.number
                ? 'bg-accent border-accent text-white'
                : 'border-gray-300 text-gray-300'
            }`}
          >
            {currentStep > step.number ? (
              <ApperIcon name="Check" size={16} />
            ) : (
              <ApperIcon name={step.icon} size={16} />
            )}
          </div>
          <Paragraph
            className={`ml-2 font-medium ${
              currentStep >= step.number ? 'text-accent' : 'text-gray-400'
            }`}
          >
            {step.title}
          </Paragraph>
          {index < steps.length - 1 && (
            <div
              className={`w-16 h-0.5 mx-4 ${
                currentStep > step.number ? 'bg-accent' : 'bg-gray-300'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default CheckoutProgressTracker;