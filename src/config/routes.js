import Home from '../pages/Home';
import Category from '../pages/Category';
import ProductDetail from '../pages/ProductDetail';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/home',
    icon: 'Home',
    component: Home
  },
  men: {
    id: 'men',
    label: 'Men',
    path: '/category/men',
    icon: 'User',
    component: Category
  },
  women: {
    id: 'women',
    label: 'Women',
    path: '/category/women',
    icon: 'User',
    component: Category
  },
  kids: {
    id: 'kids',
    label: 'Kids',
    path: '/category/kids',
    icon: 'Baby',
    component: Category
  },
  cart: {
    id: 'cart',
    label: 'Cart',
    path: '/cart',
    icon: 'ShoppingCart',
    component: Cart
  }
};

export const routeArray = Object.values(routes);