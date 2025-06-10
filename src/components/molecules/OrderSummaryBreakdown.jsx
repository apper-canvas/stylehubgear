import React from 'react';
import Paragraph from '@/components/atoms/Paragraph';

const OrderSummaryBreakdown = ({ subtotal, shipping, tax, total }) => {
  return (
    <div className="space-y-3">
      <div className="flex justify-between">
        <Paragraph>Subtotal</Paragraph>
        <Paragraph>${subtotal.toFixed(2)}</Paragraph>
      </div>
      <div className="flex justify-between">
        <Paragraph>Shipping</Paragraph>
        <Paragraph>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</Paragraph>
      </div>
      <div className="flex justify-between">
        <Paragraph>Tax</Paragraph>
        <Paragraph>${tax.toFixed(2)}</Paragraph>
      </div>
      <div className="border-t pt-3">
        <div className="flex justify-between font-semibold text-lg">
          <Paragraph>Total</Paragraph>
          <Paragraph>${total.toFixed(2)}</Paragraph>
        </div>
      </div>
    </div>
  );
};

export default OrderSummaryBreakdown;