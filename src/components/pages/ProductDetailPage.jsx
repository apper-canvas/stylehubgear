import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '@/services';
import ErrorState from '@/components/organisms/ErrorState';
import SkeletonLoader from '@/components/organisms/SkeletonLoader';
import ProductDetailMain from '@/components/organisms/ProductDetailMain';
import RelatedProductsSection from '@/components/organisms/RelatedProductsSection';
import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Heading';

const ProductDetailPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const productData = await productService.getById(productId);
        if (!productData) {
          throw new Error('Product not found');
        }
        setProduct(productData);
        
        const allProducts = await productService.getAll();
        const related = allProducts
          .filter(p => p.id !== productId && p.category === productData.category)
          .slice(0, 4);
        setRelatedProducts(related);
      } catch (err) {
        setError(err.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="aspect-square bg-gray-200 animate-pulse rounded-lg"></div>
            <div className="grid grid-cols-4 gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-square bg-gray-200 animate-pulse rounded"></div>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="h-8 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-6 bg-gray-200 animate-pulse rounded w-1/4"></div>
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 animate-pulse rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Heading as="h1" className="text-2xl font-bold text-gray-900">Product not found</Heading>
        <Button
          onClick={() => navigate(-1)}
          className="mt-4 text-accent hover:underline"
        >
          Go back
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-4">
        <nav className="text-sm text-gray-500">
          <Button onClick={() => navigate(-1)} className="hover:text-primary">
            ← Back
          </Button>
        </nav>
      </div>

      <div className="container mx-auto px-4 pb-16">
        <ProductDetailMain product={product} />
        <RelatedProductsSection products={relatedProducts} />
      </div>
    </div>
  );
};

export default ProductDetailPage;