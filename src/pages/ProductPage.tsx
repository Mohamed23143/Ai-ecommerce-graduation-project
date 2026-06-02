import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';
import ProductGallery from '../components/ProductGallery';
import ProductInfo from '../components/ProductInfo';
import CompleteTheLook from '../components/CompleteTheLook';
import Footer from '../components/Footer';
import StickyBottomBar from '../components/StickyBottomBar';
import { fetchProduct, type BackendProduct } from '../services/api';
import { formatPrice } from '../data/products';

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<BackendProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError('');
    fetchProduct(Number(id))
      .then(setProduct)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f9f8f5]">
        <Header />
        <main className="max-w-8xl mx-auto px-5 lg:px-12 py-8 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 animate-pulse">
            <div className="bg-gray-200 h-[500px] lg:h-[700px]" />
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/4" />
              <div className="h-8 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-24 bg-gray-200 rounded w-full" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#f9f8f5] flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-2xl mb-4 text-dark">
            {error ? 'Something went wrong' : 'Product not found'}
          </h1>
          <p className="text-sm font-sans text-muted mb-6">
            {error ? 'Failed to load product details.' : 'The product you are looking for does not exist.'}
          </p>
          <Link to="/" className="text-gold underline text-sm font-sans">Back to home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f8f5] pb-16">
      <Helmet>
        <title>{product.name} — NASSEG</title>
        <meta name="description" content={product.description} />
      </Helmet>
      <Header />

      <main className="max-w-8xl mx-auto px-5 lg:px-12 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
          <ProductGallery images={[product.image]} />
          <ProductInfo product={product} />
        </div>
      </main>

      <CompleteTheLook />
      <Footer />

      <StickyBottomBar
        productId={product.id}
        productImage={product.image}
        productName={product.name}
        price={formatPrice(product.price)}
        productPrice={product.price}
      />
    </div>
  );
};

export default ProductPage;
