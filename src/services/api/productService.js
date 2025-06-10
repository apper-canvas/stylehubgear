import productsData from '../mockData/products.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ProductService {
  constructor() {
    // Enhance products with additional details
    this.data = productsData.map(product => ({
      ...product,
      rating: product.rating || (Math.random() * 1.5 + 3.5).toFixed(1),
      reviewCount: product.reviewCount || Math.floor(Math.random() * 200 + 50),
      material: product.material || this.getDefaultMaterial(product.category),
      fit: product.fit || 'Regular Fit',
      type: product.type || 'Casual',
      care: product.care || 'Machine Wash Cold',
      additionalInfo: product.additionalInfo || '• Premium quality materials • Sustainable production • Model measurements vary by size',
      offers: product.offers || this.getRandomOffers(),
      colorImages: product.colorImages || this.generateColorImages(product)
    }));
  }

  getDefaultMaterial(category) {
    const materials = {
      'men': '100% Cotton',
      'women': 'Cotton Blend',
      'kids': 'Soft Cotton',
      'accessories': 'Premium Materials'
    };
    return materials[category?.toLowerCase()] || '100% Cotton';
  }

  getRandomOffers() {
    const offers = [
      'Free shipping on orders over $100',
      'Buy 2 get 1 free on selected items',
      '15% off your first order',
      'Extended 60-day returns',
      'Free gift wrapping available'
    ];
    return Math.random() > 0.6 ? [offers[Math.floor(Math.random() * offers.length)]] : [];
  }

  generateColorImages(product) {
    if (!product.colors || !product.images) return null;
    
    const colorImages = {};
    product.colors.forEach((color, index) => {
      // Assign images to colors - in real app, this would be actual color-specific images
      colorImages[color] = product.images.slice(index % product.images.length);
    });
    return colorImages;
  }

  async getAll() {
    await delay(300);
    return [...this.data];
  }

  async getById(id) {
    await delay(200);
    const product = this.data.find(item => item.id === id);
    return product ? { ...product } : null;
  }

  async create(product) {
    await delay(400);
    const newProduct = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    this.data.push(newProduct);
    return { ...newProduct };
  }

  async update(id, updates) {
    await delay(350);
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error('Product not found');
    }
    
    this.data[index] = { ...this.data[index], ...updates };
    return { ...this.data[index] };
  }

  async delete(id) {
    await delay(250);
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error('Product not found');
    }
    
    const deleted = this.data.splice(index, 1)[0];
    return { ...deleted };
  }

  async getByCategory(category) {
    await delay(300);
    return this.data.filter(product => 
      product.category.toLowerCase() === category.toLowerCase()
    ).map(product => ({ ...product }));
  }

  async search(query) {
    await delay(250);
    const searchTerm = query.toLowerCase();
    return this.data.filter(product =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm)
    ).map(product => ({ ...product }));
  }
}

export default new ProductService();