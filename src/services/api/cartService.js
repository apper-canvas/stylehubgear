import cartData from '../mockData/cart.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class CartService {
  constructor() {
    this.data = [...cartData];
  }

  async getAll() {
    await delay(200);
    return [...this.data];
  }

  async getById(id) {
    await delay(150);
    const item = this.data.find(cartItem => cartItem.id === id);
    return item ? { ...item } : null;
  }

  async create(cartItem) {
    await delay(300);
    
    // Check if item with same product, size, and color already exists
    const existingIndex = this.data.findIndex(item => 
      item.productId === cartItem.productId &&
      item.size === cartItem.size &&
      item.color === cartItem.color
    );

    if (existingIndex !== -1) {
      // Update quantity if item exists
      this.data[existingIndex].quantity += cartItem.quantity || 1;
      return { ...this.data[existingIndex] };
    } else {
      // Add new item
      const newItem = {
        ...cartItem,
        id: Date.now().toString(),
        quantity: cartItem.quantity || 1,
        addedAt: new Date().toISOString()
      };
      this.data.push(newItem);
      return { ...newItem };
    }
  }

  async update(id, updates) {
    await delay(250);
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error('Cart item not found');
    }
    
    this.data[index] = { ...this.data[index], ...updates };
    return { ...this.data[index] };
  }

  async delete(id) {
    await delay(200);
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error('Cart item not found');
    }
    
    const deleted = this.data.splice(index, 1)[0];
    return { ...deleted };
  }

  async clear() {
    await delay(150);
    this.data = [];
    return true;
  }

  async getCount() {
    await delay(100);
    return this.data.reduce((total, item) => total + item.quantity, 0);
  }

  async getTotal() {
    await delay(100);
    return this.data.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
}

export default new CartService();