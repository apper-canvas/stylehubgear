import { toast } from 'react-toastify';

class ProductService {
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
        fields: [
          'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
          'price', 'category', 'subcategory', 'images', 'sizes', 'colors', 'description',
          'in_stock', 'featured', 'rating', 'review_count', 'material', 'fit', 'type',
          'care', 'additional_info', 'offers', 'color_images', 'original_price', 'discount'
        ]
      };

      const response = await this.apperClient.fetchRecords('product', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data?.map(product => ({
        id: product.Id,
        name: product.Name,
        price: product.price,
        category: product.category,
        subcategory: product.subcategory,
        images: product.images ? product.images.split('\n').filter(img => img.trim()) : [],
        sizes: product.sizes ? product.sizes.split(',') : [],
        colors: product.colors ? product.colors.split(',') : [],
        description: product.description,
        inStock: product.in_stock,
        featured: product.featured,
        rating: product.rating,
        reviewCount: product.review_count,
        material: product.material,
        fit: product.fit,
        type: product.type,
        care: product.care,
        additionalInfo: product.additional_info,
        offers: product.offers ? product.offers.split('\n').filter(offer => offer.trim()) : [],
        colorImages: product.color_images ? JSON.parse(product.color_images) : null,
        originalPrice: product.original_price,
        discount: product.discount
      })) || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
          'price', 'category', 'subcategory', 'images', 'sizes', 'colors', 'description',
          'in_stock', 'featured', 'rating', 'review_count', 'material', 'fit', 'type',
          'care', 'additional_info', 'offers', 'color_images', 'original_price', 'discount'
        ]
      };

      const response = await this.apperClient.getRecordById('product', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (!response.data) return null;

      const product = response.data;
      return {
        id: product.Id,
        name: product.Name,
        price: product.price,
        category: product.category,
        subcategory: product.subcategory,
        images: product.images ? product.images.split('\n').filter(img => img.trim()) : [],
        sizes: product.sizes ? product.sizes.split(',') : [],
        colors: product.colors ? product.colors.split(',') : [],
        description: product.description,
        inStock: product.in_stock,
        featured: product.featured,
        rating: product.rating,
        reviewCount: product.review_count,
        material: product.material,
        fit: product.fit,
        type: product.type,
        care: product.care,
        additionalInfo: product.additional_info,
        offers: product.offers ? product.offers.split('\n').filter(offer => offer.trim()) : [],
        colorImages: product.color_images ? JSON.parse(product.color_images) : null,
        originalPrice: product.original_price,
        discount: product.discount
      };
    } catch (error) {
      console.error(`Error fetching product with ID ${id}:`, error);
      return null;
    }
  }

  async create(product) {
    try {
      const params = {
        records: [{
          Name: product.name,
          Tags: product.tags || '',
          price: product.price,
          category: product.category,
          subcategory: product.subcategory,
          images: Array.isArray(product.images) ? product.images.join('\n') : product.images,
          sizes: Array.isArray(product.sizes) ? product.sizes.join(',') : product.sizes,
          colors: Array.isArray(product.colors) ? product.colors.join(',') : product.colors,
          description: product.description,
          in_stock: product.inStock,
          featured: product.featured,
          rating: product.rating,
          review_count: product.reviewCount,
          material: product.material,
          fit: product.fit,
          type: product.type,
          care: product.care,
          additional_info: product.additionalInfo,
          offers: Array.isArray(product.offers) ? product.offers.join('\n') : product.offers,
          color_images: product.colorImages ? JSON.stringify(product.colorImages) : '',
          original_price: product.originalPrice,
          discount: product.discount
        }]
      };

      const response = await this.apperClient.createRecord('product', params);

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
          toast.success('Product created successfully');
          return this.formatProduct(successfulRecords[0].data);
        }
      }

      return null;
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Failed to create product');
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
      if (updates.price !== undefined) updateData.price = updates.price;
      if (updates.category !== undefined) updateData.category = updates.category;
      if (updates.subcategory !== undefined) updateData.subcategory = updates.subcategory;
      if (updates.images !== undefined) updateData.images = Array.isArray(updates.images) ? updates.images.join('\n') : updates.images;
      if (updates.sizes !== undefined) updateData.sizes = Array.isArray(updates.sizes) ? updates.sizes.join(',') : updates.sizes;
      if (updates.colors !== undefined) updateData.colors = Array.isArray(updates.colors) ? updates.colors.join(',') : updates.colors;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.inStock !== undefined) updateData.in_stock = updates.inStock;
      if (updates.featured !== undefined) updateData.featured = updates.featured;
      if (updates.rating !== undefined) updateData.rating = updates.rating;
      if (updates.reviewCount !== undefined) updateData.review_count = updates.reviewCount;
      if (updates.material !== undefined) updateData.material = updates.material;
      if (updates.fit !== undefined) updateData.fit = updates.fit;
      if (updates.type !== undefined) updateData.type = updates.type;
      if (updates.care !== undefined) updateData.care = updates.care;
      if (updates.additionalInfo !== undefined) updateData.additional_info = updates.additionalInfo;
      if (updates.offers !== undefined) updateData.offers = Array.isArray(updates.offers) ? updates.offers.join('\n') : updates.offers;
      if (updates.colorImages !== undefined) updateData.color_images = updates.colorImages ? JSON.stringify(updates.colorImages) : '';
      if (updates.originalPrice !== undefined) updateData.original_price = updates.originalPrice;
      if (updates.discount !== undefined) updateData.discount = updates.discount;

      const params = {
        records: [updateData]
      };

      const response = await this.apperClient.updateRecord('product', params);

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
          toast.success('Product updated successfully');
          return this.formatProduct(successfulUpdates[0].data);
        }
      }

      return null;
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord('product', params);

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
          toast.success('Product deleted successfully');
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
      throw error;
    }
  }

  formatProduct(product) {
    return {
      id: product.Id,
      name: product.Name,
      price: product.price,
      category: product.category,
      subcategory: product.subcategory,
      images: product.images ? product.images.split('\n').filter(img => img.trim()) : [],
      sizes: product.sizes ? product.sizes.split(',') : [],
      colors: product.colors ? product.colors.split(',') : [],
      description: product.description,
      inStock: product.in_stock,
      featured: product.featured,
      rating: product.rating,
      reviewCount: product.review_count,
      material: product.material,
      fit: product.fit,
      type: product.type,
      care: product.care,
      additionalInfo: product.additional_info,
      offers: product.offers ? product.offers.split('\n').filter(offer => offer.trim()) : [],
      colorImages: product.color_images ? JSON.parse(product.color_images) : null,
      originalPrice: product.original_price,
      discount: product.discount
    };
  }

  async getByCategory(category) {
    try {
      const params = {
        fields: [
          'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
          'price', 'category', 'subcategory', 'images', 'sizes', 'colors', 'description',
          'in_stock', 'featured', 'rating', 'review_count', 'material', 'fit', 'type',
          'care', 'additional_info', 'offers', 'color_images', 'original_price', 'discount'
        ],
        where: [
          {
            fieldName: 'category',
            operator: 'ExactMatch',
            values: [category]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords('product', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data?.map(product => this.formatProduct(product)) || [];
    } catch (error) {
      console.error('Error fetching products by category:', error);
      return [];
    }
  }

  async search(query) {
    try {
      const params = {
        fields: [
          'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
          'price', 'category', 'subcategory', 'images', 'sizes', 'colors', 'description',
          'in_stock', 'featured', 'rating', 'review_count', 'material', 'fit', 'type',
          'care', 'additional_info', 'offers', 'color_images', 'original_price', 'discount'
        ],
        whereGroups: [
          {
            operator: 'OR',
            subGroups: [
              {
                conditions: [
                  {
                    fieldName: 'Name',
                    operator: 'Contains',
                    values: [query]
                  }
                ]
              },
              {
                conditions: [
                  {
                    fieldName: 'description',
                    operator: 'Contains',
                    values: [query]
                  }
                ]
              }
            ]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords('product', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data?.map(product => this.formatProduct(product)) || [];
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  }
}

export default new ProductService();