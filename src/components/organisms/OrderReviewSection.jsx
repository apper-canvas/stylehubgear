import React from 'react';
import { motion } from 'framer-motion';
import Heading from '@/components/atoms/Heading';
import Paragraph from '@/components/atoms/Paragraph';
import Image from '@/components/atoms/Image';
import Button from '@/components/atoms/Button';

const OrderReviewSection = ({ cartItems, products, shippingInfo, paymentInfo, onBackStep, onSubmit, submitting }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
    >
      <Heading as="h2" className="text-xl font-semibold mb-6">Review Your Order</Heading>
      
      <div className="space-y-6">
        <div>
          <Heading as="h3" className="font-semibold mb-3">Items</Heading>
          <div className="space-y-3">
            {cartItems.map(item => {
              const product = products[item.productId];
              if (!product) return null;
              
              return (
                <div key={item.id} className="flex items-center space-x-3">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    className="w-12 h-12 rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <Paragraph className="font-medium break-words">{product.name}</Paragraph>
                    <Paragraph className="text-sm text-gray-500">
                      {item.size && `Size: ${item.size}`}
                      {item.size && item.color && ' • '}
                      {item.color && `Color: ${item.color}`}
                    </Paragraph>
                  </div>
                  <Paragraph className="font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </Paragraph>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <Heading as="h3" className="font-semibold mb-3">Shipping Address</Heading>
          <div className="text-gray-600">
            <Paragraph>{shippingInfo.firstName} {shippingInfo.lastName}</Paragraph>
            <Paragraph>{shippingInfo.address}</Paragraph>
            <Paragraph>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</Paragraph>
            <Paragraph>{shippingInfo.email}</Paragraph>
          </div>
        </div>

        <div>
          <Heading as="h3" className="font-semibold mb-3">Payment Method</Heading>
          <div className="text-gray-600">
            <Paragraph>**** **** **** {paymentInfo.cardNumber.slice(-4)}</Paragraph>
            <Paragraph>{paymentInfo.cardholderName}</Paragraph>
          </div>
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
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          onClick={onSubmit}
          disabled={submitting}
          className="bg-accent text-white px-8 py-2 rounded-lg font-semibold hover:bg-accent/90 transition-colors disabled:opacity-50"
        >
          {submitting ? 'Placing Order...' : 'Place Order'}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default OrderReviewSection;