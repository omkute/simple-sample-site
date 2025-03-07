
import { useState, useEffect } from 'react';
import { IndianRupee } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

interface Company {
  id: string;
  name: string;
  market_cap: number;
  public_shares_percent: number;
  current_price: number;
  created_at: string;
}

const ListedCompanies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const { data, error } = await supabase
          .from('companies')
          .select('id, name, market_cap, public_shares_percent, current_price, created_at')
          .eq('is_approved', true)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setCompanies(data || []);
      } catch (error) {
        console.error('Error fetching companies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-gray-900 mb-4">Listed Companies</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((index) => (
              <div key={index} className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">Listed Companies</h2>
        </div>
        
        {companies.length === 0 ? (
          <div className="text-center py-10">
            <p>No companies are currently listed on the exchange.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {companies.map((company) => (
              <div 
                key={company.id} 
                className="card card-hover animate-slide-up overflow-hidden"
                style={{ animationDelay: `${Math.random() * 300}ms` }}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold">{company.name}</h3>
                  <div className="flex items-center text-lg font-bold">
                    <IndianRupee size={18} className="mr-1" />
                    {company.market_cap?.toFixed(2) || "0.00"}
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Public Shares:</span>
                    <span className="font-medium">{company.public_shares_percent?.toFixed(1) || "0"}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Price per Share:</span>
                    <span className="font-medium flex items-center">
                      <IndianRupee size={14} className="mr-1" />
                      {company.current_price?.toFixed(2) || "0.00"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Listed Date:</span>
                    <span className="font-medium">{new Date(company.created_at).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>
                
                <div className="text-xs text-gray-500 mt-4 pt-4 border-t">
                  Based on <IndianRupee size={10} className="inline" />{company.market_cap?.toFixed(2) || "0.00"} market cap
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ListedCompanies;
