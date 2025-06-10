import { toast } from 'react-toastify';

class CategoryService {
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
        fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'slug', 'subcategories']
      };

      const response = await this.apperClient.fetchRecords('category', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data?.map(category => ({
        id: category.Id,
        name: category.Name,
        slug: category.slug,
        subcategories: category.subcategories ? category.subcategories.split('\n').filter(sub => sub.trim()) : []
      })) || [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'slug', 'subcategories']
      };

      const response = await this.apperClient.getRecordById('category', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (!response.data) return null;

      const category = response.data;
      return {
        id: category.Id,
        name: category.Name,
        slug: category.slug,
        subcategories: category.subcategories ? category.subcategories.split('\n').filter(sub => sub.trim()) : []
      };
    } catch (error) {
      console.error(`Error fetching category with ID ${id}:`, error);
      return null;
    }
  }

  async getBySlug(slug) {
    try {
      const params = {
        fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'slug', 'subcategories'],
        where: [
          {
            fieldName: 'slug',
            operator: 'ExactMatch',
            values: [slug]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords('category', params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (!response.data || response.data.length === 0) return null;

      const category = response.data[0];
      return {
        id: category.Id,
        name: category.Name,
        slug: category.slug,
        subcategories: category.subcategories ? category.subcategories.split('\n').filter(sub => sub.trim()) : []
      };
    } catch (error) {
      console.error(`Error fetching category with slug ${slug}:`, error);
      return null;
    }
  }

  async create(category) {
    try {
      const params = {
        records: [{
          Name: category.name,
          Tags: category.tags || '',
          slug: category.slug || category.name.toLowerCase().replace(/\s+/g, '-'),
          subcategories: Array.isArray(category.subcategories) ? category.subcategories.join('\n') : category.subcategories || ''
        }]
      };

      const response = await this.apperClient.createRecord('category', params);

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
          toast.success('Category created successfully');
          const cat = successfulRecords[0].data;
          return {
            id: cat.Id,
            name: cat.Name,
            slug: cat.slug,
            subcategories: cat.subcategories ? cat.subcategories.split('\n').filter(sub => sub.trim()) : []
          };
        }
      }

      return null;
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error('Failed to create category');
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
      if (updates.slug !== undefined) updateData.slug = updates.slug;
      if (updates.subcategories !== undefined) updateData.subcategories = Array.isArray(updates.subcategories) ? updates.subcategories.join('\n') : updates.subcategories;

      const params = {
        records: [updateData]
      };

      const response = await this.apperClient.updateRecord('category', params);

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
          toast.success('Category updated successfully');
          const cat = successfulUpdates[0].data;
          return {
            id: cat.Id,
            name: cat.Name,
            slug: cat.slug,
            subcategories: cat.subcategories ? cat.subcategories.split('\n').filter(sub => sub.trim()) : []
          };
        }
      }

      return null;
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Failed to update category');
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord('category', params);

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
          toast.success('Category deleted successfully');
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
      throw error;
    }
  }
}

export default new CategoryService();