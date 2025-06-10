import React from 'react';
import { motion } from 'framer-motion';
import Heading from '@/components/atoms/Heading';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';

const PaymentForm = ({ paymentInfo, onInfoChange, onBackStep, onNextStep }) => {
  const handleChange = (field, value) => {
    onInfoChange(prev => ({ ...prev, [field]: value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
    >
      <Heading as="h2" className="text-xl font-semibold mb-6">Payment Information</Heading>
      
      <div className="space-y-4">
        <FormField
          id="cardholderName"
          label="Cardholder Name"
          type="text"
          value={paymentInfo.cardholderName}
          onChange={(e) => handleChange('cardholderName', e.target.value)}
          required
        />
        <FormField
          id="cardNumber"
          label="Card Number"
          type="text"
          value={paymentInfo.cardNumber}
          onChange={(e) => handleChange('cardNumber', e.target.value)}
          placeholder="1234 5678 9012 3456"
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            id="expiryDate"
            label="Expiry Date"
            type="text"
            value={paymentInfo.expiryDate}
            onChange={(e) => handleChange('expiryDate', e.target.value)}
            placeholder="MM/YY"
            required
          />
          <FormField
            id="cvv"
            label="CVV"
            type="text"
            value={paymentInfo.cvv}
            onChange={(e) => handleChange('cvv', e.target.value)}
            placeholder="123"
            required
          />
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <Button
          type="button"
          onClick={onBackStep}
          className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
        >
          Back
        </Button>
        <Button
          type="button"
          onClick={onNextStep}
          className="bg-accent text-white px-6 py-2 rounded-lg font-semibold hover:bg-accent/90 transition-colors"
        >
          Review Order
        </Button>
      </div>
    </motion.div>
  );
};

export default PaymentForm;