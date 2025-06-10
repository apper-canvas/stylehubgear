import HomePage from '@/components/pages/HomePage';
import CategoryPage from '@/components/pages/CategoryPage';
import ProductDetailPage from '@/components/pages/ProductDetailPage';
import CartPage from '@/components/pages/CartPage';
import CheckoutPage from '@/components/pages/CheckoutPage';

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/home',
    icon: 'Home',
component: HomePage
  },
  men: {
    id: 'men',
    label: 'Men',
    path: '/category/men',
    icon: 'User',
component: CategoryPage
  },
  women: {
    id: 'women',
    label: 'Women',
    path: '/category/women',
    icon: 'User',
component: CategoryPage
  },
  kids: {
    id: 'kids',
    label: 'Kids',
    path: '/category/kids',
    icon: 'Baby',
component: CategoryPage
  },
  cart: {
    id: 'cart',
    label: 'Cart',
    path: '/cart',
    icon: 'ShoppingCart',
component: CartPage
  }
};

export const routeArray = Object.values(routes);