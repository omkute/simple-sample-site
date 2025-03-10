
import { useEffect } from 'react';
import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import ListedCompanies from '@/components/ListedCompanies';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Index = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <HowItWorks />
        <ListedCompanies />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
