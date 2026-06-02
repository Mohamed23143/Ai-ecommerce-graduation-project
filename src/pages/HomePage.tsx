import { Helmet } from 'react-helmet-async';
import HomeHeader from '../components/home/HomeHeader';
import Footer from '../components/Footer';
import HeroSection from '../components/home/HeroSection';
import TrendingNow from '../components/home/TrendingNow';
import ShopByCategory from '../components/home/ShopByCategory';
import BrandStory from '../components/home/BrandStory';
import ContactSection from '../components/home/ContactSection';

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>NASSEG — AI-Powered Fashion Boutique</title>
        <meta name="description" content="Discover luxury fashion at NASSEG — an AI-powered boutique featuring curated collections, smart recommendations, and seamless shopping." />
      </Helmet>
    <div className="min-h-screen bg-[#f9f8f5]">
      <HomeHeader />
      <div className="-mt-[72px]">
        <HeroSection />
        <TrendingNow />
        <ShopByCategory />
        <BrandStory />
        <ContactSection />
      </div>
      <Footer />
    </div>
    </>
  );
};

export default HomePage;
