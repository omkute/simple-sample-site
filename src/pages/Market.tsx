
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MarketOverview from '@/components/MarketOverview';

const Market = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-sebba-lightgray">
        <MarketOverview />
      </main>
      <Footer />
    </div>
  );
};

export default Market;
