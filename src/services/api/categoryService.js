import categoriesData from '../mockData/categories.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class CategoryService {
  constructor() {
    this.data = [...categoriesData];
  }

  async getAll() {
    await delay(200);
    return [...this.data];
  }

  async getById(id) {
    await delay(150);
    const category = this.data.find(item => item.id === id);
    return category ? { ...category } : null;
  }

  async getBySlug(slug) {
    await delay(150);
    const category = this.data.find(item => item.slug === slug);
    return category ? { ...category } : null;
  }

  async create(category) {
    await delay(300);
    const newCategory = {
      ...category,
      id: Date.now().toString(),
      slug: category.name.toLowerCase().replace(/\s+/g, '-'),
      createdAt: new Date().toISOString()
    };
    this.data.push(newCategory);
    return { ...newCategory };
  }

  async update(id, updates) {
    await delay(250);
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error('Category not found');
    }
    
    this.data[index] = { ...this.data[index], ...updates };
    return { ...this.data[index] };
  }

  async delete(id) {
    await delay(200);
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error('Category not found');
    }
    
    const deleted = this.data.splice(index, 1)[0];
    return { ...deleted };
  }
}

export default new CategoryService();