import { toast } from 'react-toastify';

class OrderService {
  constructor() {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  async getAll() {
    try {
      const params = {
        fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 
                 'order_number', 'total', 'status', 'shipping_address', 'payment_info', 'created_at']
      };

      const response = await this.apperClient.fetchRecords('order', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data?.map(order => ({
        id: order.Id,
        orderNumber: order.order_number,
        total: order.total,
        status: order.status,
        shippingAddress: order.shipping_address ? JSON.parse(order.shipping_address) : null,
        paymentInfo: order.payment_info ? JSON.parse(order.payment_info) : null,
        createdAt: order.created_at
      })) || [];
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 
                 'order_number', 'total', 'status', 'shipping_address', 'payment_info', 'created_at']
      };

      const response = await this.apperClient.getRecordById('order', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (!response.data) return null;

      const order = response.data;
      return {
        id: order.Id,
        orderNumber: order.order_number,
        total: order.total,
        status: order.status,
        shippingAddress: order.shipping_address ? JSON.parse(order.shipping_address) : null,
        paymentInfo: order.payment_info ? JSON.parse(order.payment_info) : null,
        createdAt: order.created_at
      };
    } catch (error) {
      console.error(`Error fetching order with ID ${id}:`, error);
      return null;
    }
  }

  async create(order) {
    try {
      const params = {
        records: [{
          Name: order.name || `Order ${Date.now()}`,
          Tags: order.tags || '',
          order_number: order.orderNumber || `ORD-${Date.now()}`,
          total: order.total,
          status: order.status || 'pending',
          shipping_address: order.shippingAddress ? JSON.stringify(order.shippingAddress) : '',
          payment_info: order.paymentInfo ? JSON.stringify(order.paymentInfo) : '',
          created_at: order.createdAt || new Date().toISOString()
        }]
      };

      const response = await this.apperClient.createRecord('order', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${failedRecords}`);
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulRecords.length > 0) {
          toast.success('Order created successfully');
          const ord = successfulRecords[0].data;
          return {
            id: ord.Id,
            orderNumber: ord.order_number,
            total: ord.total,
            status: ord.status,
            shippingAddress: ord.shipping_address ? JSON.parse(ord.shipping_address) : null,
            paymentInfo: ord.payment_info ? JSON.parse(ord.payment_info) : null,
            createdAt: ord.created_at
          };
        }
      }

      return null;
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to create order');
      throw error;
    }
  }

  async update(id, updates) {
    try {
      const updateData = {
        Id: parseInt(id)
      };

      // Only include updateable fields
      if (updates.name !== undefined) updateData.Name = updates.name;
      if (updates.tags !== undefined) updateData.Tags = updates.tags;
      if (updates.orderNumber !== undefined) updateData.order_number = updates.orderNumber;
      if (updates.total !== undefined) updateData.total = updates.total;
      if (updates.status !== undefined) updateData.status = updates.status;
      if (updates.shippingAddress !== undefined) updateData.shipping_address = updates.shippingAddress ? JSON.stringify(updates.shippingAddress) : '';
      if (updates.paymentInfo !== undefined) updateData.payment_info = updates.paymentInfo ? JSON.stringify(updates.paymentInfo) : '';
      if (updates.createdAt !== undefined) updateData.created_at = updates.createdAt;

      const params = {
        records: [updateData]
      };

      const response = await this.apperClient.updateRecord('order', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${failedUpdates}`);
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulUpdates.length > 0) {
          toast.success('Order updated successfully');
          const ord = successfulUpdates[0].data;
          return {
            id: ord.Id,
            orderNumber: ord.order_number,
            total: ord.total,
            status: ord.status,
            shippingAddress: ord.shipping_address ? JSON.parse(ord.shipping_address) : null,
            paymentInfo: ord.payment_info ? JSON.parse(ord.payment_info) : null,
            createdAt: ord.created_at
          };
        }
      }

      return null;
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order');
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord('order', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${failedDeletions}`);
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulDeletions.length > 0) {
          toast.success('Order deleted successfully');
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error('Failed to delete order');
      throw error;
    }
  }

  async getByStatus(status) {
    try {
      const params = {
        fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 
                 'order_number', 'total', 'status', 'shipping_address', 'payment_info', 'created_at'],
        where: [
          {
            fieldName: 'status',
            operator: 'ExactMatch',
            values: [status]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords('order', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data?.map(order => ({
        id: order.Id,
        orderNumber: order.order_number,
        total: order.total,
        status: order.status,
        shippingAddress: order.shipping_address ? JSON.parse(order.shipping_address) : null,
        paymentInfo: order.payment_info ? JSON.parse(order.payment_info) : null,
        createdAt: order.created_at
      })) || [];
    } catch (error) {
      console.error('Error fetching orders by status:', error);
      return [];
    }
  }

  async updateStatus(id, status) {
    return this.update(id, { status });
  }
}

export default new OrderService();