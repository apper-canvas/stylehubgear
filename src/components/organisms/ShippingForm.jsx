import React from 'react';
import { motion } from 'framer-motion';
import Heading from '@/components/atoms/Heading';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';

const ShippingForm = ({ shippingInfo, onInfoChange, onNextStep }) => {
  const handleChange = (field, value) => {
    onInfoChange(prev => ({ ...prev, [field]: value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
    >
      <Heading as="h2" className="text-xl font-semibold mb-6">Shipping Information</Heading>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          id="firstName"
          label="First Name"
          type="text"
          value={shippingInfo.firstName}
          onChange={(e) => handleChange('firstName', e.target.value)}
          required
        />
        <FormField
          id="lastName"
          label="Last Name"
          type="text"
          value={shippingInfo.lastName}
          onChange={(e) => handleChange('lastName', e.target.value)}
          required
        />
        <FormField
          id="email"
          label="Email"
          type="email"
          value={shippingInfo.email}
          onChange={(e) => handleChange('email', e.target.value)}
          required
        />
        <FormField
          id="phone"
          label="Phone"
          type="tel"
          value={shippingInfo.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
        />
        <FormField
          id="address"
          label="Address"
          type="text"
          value={shippingInfo.address}
          onChange={(e) => handleChange('address', e.target.value)}
          required
          className="md:col-span-2"
        />
        <FormField
          id="city"
          label="City"
          type="text"
          value={shippingInfo.city}
          onChange={(e) => handleChange('city', e.target.value)}
          required
        />
        <FormField
          id="state"
          label="State"
          type="text"
          value={shippingInfo.state}
          onChange={(e) => handleChange('state', e.target.value)}
          required
        />
        <FormField
          id="zipCode"
          label="ZIP Code"
          type="text"
          value={shippingInfo.zipCode}
          onChange={(e) => handleChange('zipCode', e.target.value)}
          required
        />
      </div>

      <div className="flex justify-end mt-6">
        <Button
          type="button"
          onClick={onNextStep}
          className="bg-accent text-white px-6 py-2 rounded-lg font-semibold hover:bg-accent/90 transition-colors"
        >
          Continue to Payment
        </Button>
      </div>
    </motion.div>
  );
};

export default ShippingForm;