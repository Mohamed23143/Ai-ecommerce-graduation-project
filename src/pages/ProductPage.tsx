import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import ProductGallery from '../components/ProductGallery';
import ProductInfo from '../components/ProductInfo';
import CompleteTheLook from '../components/CompleteTheLook';
import Footer from '../components/Footer';
import StickyBottomBar from '../components/StickyBottomBar';
import { allProducts, formatPrice } from '../data/products';

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const product = allProducts.find(p => p.id === Number(id));

  if (!product) {
    return (
      <div className="min-h-screen bg-[#f9f8f5] flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-2xl mb-4">Product not found</h1>
          <Link to="/" className="text-gold underline">Back to home</Link>
        </div>
      </div>
    );
  }

  const productImages = [
    product.image,
    'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=800&h=1000&fit=crop&crop=top',
    'https://images.unsplash.com/photo-1608257040018-b47377b1dccd?w=800&h=1000&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800&h=1000&fit=crop&crop=top',
  ];

  return (
    <div className="min-h-screen bg-[#f9f8f5] pb-16">
      <Header />

      <main className="max-w-8xl mx-auto px-5 lg:px-12 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
          <ProductGallery images={productImages} />
          <ProductInfo product={product} />
        </div>
      </main>

      <CompleteTheLook />
      <Footer />

      <StickyBottomBar
        productImage={product.image}
        productName={product.name}
        price={formatPrice(product.price)}
      />
    </div>
  );
};

export default ProductPage;
