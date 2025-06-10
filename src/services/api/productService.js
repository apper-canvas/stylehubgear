import productsData from '../mockData/products.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ProductService {
  constructor() {
    this.data = [...productsData];
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