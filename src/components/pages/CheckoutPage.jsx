import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { cartService, orderService, productService } from '@/services';
import Heading from '@/components/atoms/Heading';
import Paragraph from '@/components/atoms/Paragraph';
import CheckoutProgressTracker from '@/components/organisms/CheckoutProgressTracker';
import ShippingForm from '@/components/organisms/ShippingForm';
import PaymentForm from '@/components/organisms/PaymentForm';
import OrderReviewSection from '@/components/organisms/OrderReviewSection';
import OrderSummaryBreakdown from '@/components/molecules/OrderSummaryBreakdown';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);
      try {
        const items = await cartService.getAll();
        if (items.length === 0) {
          navigate('/cart');
          return;
        }
        setCartItems(items);

        const productIds = [...new Set(items.map(item => item.productId))];
        const productPromises = productIds.map(id => productService.getById(id));
        const productResults = await Promise.all(productPromises);
        
        const productsMap = {};
        productResults.forEach(product => {
          if (product) productsMap[product.id] = product;
        });
        setProducts(productsMap);
      } catch (error) {
        toast.error('Failed to load cart');
      } finally {
        setLoading(false);
      }
    };
    loadCart();
  }, [navigate]);

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const subtotal = calculateSubtotal();
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const validateStep = (step) => {
    switch (step) {
      case 1:
        const requiredShipping = ['firstName', 'lastName', 'email', 'address', 'city', 'state', 'zipCode'];
        return requiredShipping.every(field => shippingInfo[field].trim());
      case 2:
        const requiredPayment = ['cardNumber', 'expiryDate', 'cvv', 'cardholderName'];
        return requiredPayment.every(field => paymentInfo[field].trim());
      default:
        return true;
    }
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    } else {
      toast.error('Please fill in all required fields');
    }
  };

  const handleBackStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) { // Re-validate current step if not already validated
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const orderData = {
        items: cartItems,
        total: total,
        shippingAddress: shippingInfo,
        paymentInfo: {
          ...paymentInfo,
          cardNumber: '**** **** **** ' + paymentInfo.cardNumber.slice(-4)
        },
        status: 'confirmed'
      };

      const order = await orderService.create(orderData);
      
      await Promise.all(cartItems.map(item => cartService.delete(item.id)));
      
      toast.success('Order placed successfully!');
      navigate(`/order-confirmation/${order.id}`);
    } catch (error) {
      toast.error('Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const steps = [
    { number: 1, title: 'Shipping', icon: 'Truck' },
    { number: 2, title: 'Payment', icon: 'CreditCard' },
    { number: 3, title: 'Review', icon: 'CheckCircle' }
  ];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Heading as="h1" className="text-display-md mb-8 font-display">Checkout</Heading>
          <CheckoutProgressTracker currentStep={currentStep} steps={steps} />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              {currentStep === 1 && (
                <ShippingForm 
                  shippingInfo={shippingInfo} 
                  onInfoChange={setShippingInfo} 
                  onNextStep={handleNextStep} 
                />
              )}

              {currentStep === 2 && (
                <PaymentForm 
                  paymentInfo={paymentInfo} 
                  onInfoChange={setPaymentInfo} 
                  onBackStep={handleBackStep} 
                  onNextStep={handleNextStep} 
                />
              )}

              {currentStep === 3 && (
                <OrderReviewSection 
                  cartItems={cartItems} 
                  products={products}
                  shippingInfo={shippingInfo} 
                  paymentInfo={paymentInfo}
                  onBackStep={handleBackStep} 
                  onSubmit={handleSubmit} 
                  submitting={submitting}
                />
              )}
            </form>
          </div>

          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-8"
            >
              <Heading as="h2" className="font-semibold text-lg mb-4">Order Summary</Heading>
              
              <div className="space-y-3 mb-4">
                {cartItems.map(item => {
                  const product = products[item.productId];
                  if (!product) return null;
                  
                  return (
                    <div key={item.id} className="flex justify-between text-sm">
                      <Paragraph className="break-words mr-2">
                        {product.name} x{item.quantity}
                      </Paragraph>
                      <Paragraph>${(item.price * item.quantity).toFixed(2)}</Paragraph>
                    </div>
                  );
                })}
              </div>

              <OrderSummaryBreakdown subtotal={subtotal} shipping={shipping} tax={tax} total={total} />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;