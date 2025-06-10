import { toast } from 'react-toastify';

class CartService {
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
                 'product_id', 'quantity', 'size', 'color', 'price', 'added_at']
      };

      const response = await this.apperClient.fetchRecords('cart', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data?.map(item => ({
        id: item.Id,
        productId: item.product_id,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        price: item.price,
        addedAt: item.added_at
      })) || [];
    } catch (error) {
      console.error('Error fetching cart items:', error);
      toast.error('Failed to load cart items');
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 
                 'product_id', 'quantity', 'size', 'color', 'price', 'added_at']
      };

      const response = await this.apperClient.getRecordById('cart', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (!response.data) return null;

      const item = response.data;
      return {
        id: item.Id,
        productId: item.product_id,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        price: item.price,
        addedAt: item.added_at
      };
    } catch (error) {
      console.error(`Error fetching cart item with ID ${id}:`, error);
      return null;
    }
  }

  async create(cartItem) {
    try {
      // First check if item with same product, size, and color already exists
      const existingParams = {
        fields: ['Name', 'product_id', 'quantity', 'size', 'color', 'price'],
        whereGroups: [
          {
            operator: 'AND',
            subGroups: [
              {
                conditions: [
                  {
                    fieldName: 'product_id',
                    operator: 'EqualTo',
                    values: [parseInt(cartItem.productId)]
                  }
                ]
              },
              {
                conditions: [
                  {
                    fieldName: 'size',
                    operator: 'ExactMatch',
                    values: [cartItem.size || '']
                  }
                ]
              },
              {
                conditions: [
                  {
                    fieldName: 'color',
                    operator: 'ExactMatch',
                    values: [cartItem.color || '']
                  }
                ]
              }
            ]
          }
        ]
      };

      const existingResponse = await this.apperClient.fetchRecords('cart', existingParams);
      
      if (existingResponse.success && existingResponse.data && existingResponse.data.length > 0) {
        // Update existing item quantity
        const existingItem = existingResponse.data[0];
        const newQuantity = existingItem.quantity + (cartItem.quantity || 1);
        
        return await this.update(existingItem.Id, { quantity: newQuantity });
      } else {
        // Create new item
        const params = {
          records: [{
            Name: `Cart Item ${Date.now()}`,
            product_id: parseInt(cartItem.productId),
            quantity: cartItem.quantity || 1,
            size: cartItem.size || '',
            color: cartItem.color || '',
            price: cartItem.price,
            added_at: new Date().toISOString()
          }]
        };

        const response = await this.apperClient.createRecord('cart', params);

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
            toast.success('Item added to cart');
            const item = successfulRecords[0].data;
            return {
              id: item.Id,
              productId: item.product_id,
              quantity: item.quantity,
              size: item.size,
              color: item.color,
              price: item.price,
              addedAt: item.added_at
            };
          }
        }

        return null;
      }
    } catch (error) {
      console.error('Error creating cart item:', error);
      toast.error('Failed to add item to cart');
      throw error;
    }
  }

  async update(id, updates) {
    try {
      const updateData = {
        Id: parseInt(id)
      };

      // Only include updateable fields
      if (updates.quantity !== undefined) updateData.quantity = updates.quantity;
      if (updates.size !== undefined) updateData.size = updates.size;
      if (updates.color !== undefined) updateData.color = updates.color;
      if (updates.price !== undefined) updateData.price = updates.price;

      const params = {
        records: [updateData]
      };

      const response = await this.apperClient.updateRecord('cart', params);

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
          toast.success('Cart item updated');
          const item = successfulUpdates[0].data;
          return {
            id: item.Id,
            productId: item.product_id,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
            price: item.price,
            addedAt: item.added_at
          };
        }
      }

      return null;
    } catch (error) {
      console.error('Error updating cart item:', error);
      toast.error('Failed to update cart item');
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord('cart', params);

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
          toast.success('Item removed from cart');
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Error deleting cart item:', error);
      toast.error('Failed to remove item from cart');
      throw error;
    }
  }

  async clear() {
    try {
      // Get all cart items first
      const allItems = await this.getAll();
      
      if (allItems.length === 0) {
        return true;
      }

      const params = {
        RecordIds: allItems.map(item => parseInt(item.id))
      };

      const response = await this.apperClient.deleteRecord('cart', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      toast.success('Cart cleared');
      return true;
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
      return false;
    }
  }

  async getCount() {
    try {
      const items = await this.getAll();
      return items.reduce((total, item) => total + item.quantity, 0);
    } catch (error) {
      console.error('Error getting cart count:', error);
      return 0;
    }
  }

  async getTotal() {
    try {
      const items = await this.getAll();
      return items.reduce((total, item) => total + (item.price * item.quantity), 0);
    } catch (error) {
      console.error('Error getting cart total:', error);
      return 0;
    }
  }
}

export default new CartService();