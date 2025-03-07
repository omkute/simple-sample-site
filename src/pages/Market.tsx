
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MarketOverview from '@/components/MarketOverview';
import ListedCompanies from '@/components/ListedCompanies';
import UserPortfolio from '@/components/UserPortfolio';
import { useAuth } from '@/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Market = () => {
  const { profile } = useAuth();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-sebba-lightgray">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Tabs defaultValue="market" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="market">Market Overview</TabsTrigger>
              <TabsTrigger value="companies">Listed Companies</TabsTrigger>
              {profile && <TabsTrigger value="portfolio">My Portfolio</TabsTrigger>}
            </TabsList>
            
            <TabsContent value="market">
              <MarketOverview />
            </TabsContent>
            
            <TabsContent value="companies">
              <ListedCompanies />
            </TabsContent>
            
            <TabsContent value="portfolio">
              <UserPortfolio />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Market;
