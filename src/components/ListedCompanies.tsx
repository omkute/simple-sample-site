
import { useState, useEffect } from 'react';
import { IndianRupee } from 'lucide-react';

interface Company {
  id: number;
  name: string;
  marketCap: number;
  publicShares: number;
  pricePerShare: number;
  listedDate: string;
}

const ListedCompanies = () => {
  const [companies, setCompanies] = useState<Company[]>([
    {
      id: 1,
      name: "Mahindra & Mahindra",
      marketCap: 3000,
      publicShares: 10,
      pricePerShare: 3,
      listedDate: "2025-04-03"
    },
    {
      id: 2,
      name: "TechSpark Solutions",
      marketCap: 5000,
      publicShares: 15,
      pricePerShare: 5,
      listedDate: "2025-03-28"
    },
    {
      id: 3,
      name: "AquaFresh Industries",
      marketCap: 2500,
      publicShares: 8,
      pricePerShare: 2.5,
      listedDate: "2025-04-01"
    }
  ]);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">Listed Companies</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {companies.map((company) => (
            <div 
              key={company.id} 
              className="card card-hover animate-slide-up overflow-hidden"
              style={{ animationDelay: `${company.id * 100}ms` }}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold">{company.name}</h3>
                <div className="flex items-center text-lg font-bold">
                  <IndianRupee size={18} className="mr-1" />
                  {company.marketCap.toFixed(2)}
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Public Shares:</span>
                  <span className="font-medium">{company.publicShares}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Price per Share:</span>
                  <span className="font-medium flex items-center">
                    <IndianRupee size={14} className="mr-1" />
                    {company.pricePerShare.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Listed Date:</span>
                  <span className="font-medium">{new Date(company.listedDate).toLocaleDateString('en-IN')}</span>
                </div>
              </div>
              
              <div className="text-xs text-gray-500 mt-4 pt-4 border-t">
                Based on <IndianRupee size={10} className="inline" />{company.marketCap.toFixed(2)} market cap
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ListedCompanies;
