import ordersData from '../mockData/orders.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class OrderService {
  constructor() {
    this.data = [...ordersData];
  }

  async getAll() {
    await delay(300);
    return [...this.data];
  }

  async getById(id) {
    await delay(200);
    const order = this.data.find(item => item.id === id);
    return order ? { ...order } : null;
  }

  async create(order) {
    await delay(500);
    const newOrder = {
      ...order,
      id: Date.now().toString(),
      orderNumber: `ORD-${Date.now()}`,
      status: order.status || 'pending',
      createdAt: new Date().toISOString()
    };
    this.data.push(newOrder);
    return { ...newOrder };
  }

  async update(id, updates) {
    await delay(350);
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error('Order not found');
    }
    
    this.data[index] = { ...this.data[index], ...updates, updatedAt: new Date().toISOString() };
    return { ...this.data[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error('Order not found');
    }
    
    const deleted = this.data.splice(index, 1)[0];
    return { ...deleted };
  }

  async getByStatus(status) {
    await delay(250);
    return this.data.filter(order => 
      order.status.toLowerCase() === status.toLowerCase()
    ).map(order => ({ ...order }));
  }

  async updateStatus(id, status) {
    await delay(300);
    return this.update(id, { status });
  }
}

export default new OrderService();