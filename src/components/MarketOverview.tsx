
import { useState } from 'react';
import { IndianRupee, TrendingUp, TrendingDown } from 'lucide-react';

interface Stock {
  id: number;
  company: string;
  sharePrice: number;
  availableShares: number;
  totalSharesValue: number;
  marketValue: number;
  trend: 'up' | 'down' | 'neutral';
}

const MarketOverview = () => {
  const [stocks, setStocks] = useState<Stock[]>([
    {
      id: 1,
      company: "Mahindra & Mahindra",
      sharePrice: 3,
      availableShares: 100,
      totalSharesValue: 1000,
      marketValue: 3000,
      trend: 'up'
    },
    {
      id: 2,
      company: "TechSpark Solutions",
      sharePrice: 5,
      availableShares: 150,
      totalSharesValue: 1500,
      marketValue: 5000,
      trend: 'down'
    },
    {
      id: 3,
      company: "AquaFresh Industries",
      sharePrice: 2.5,
      availableShares: 80,
      totalSharesValue: 800,
      marketValue: 2500,
      trend: 'up'
    }
  ]);

  const totalStocks = stocks.length;
  const averagePrice = stocks.reduce((acc, stock) => acc + stock.sharePrice, 0) / totalStocks;

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold mb-8">Stock Market Overview</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <h3 className="text-gray-600 text-sm mb-2">Market Statistics</h3>
            <p className="text-gray-900 font-semibold mb-4">Current Overview</p>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Total Stocks</span>
                <span className="text-lg font-semibold">{totalStocks}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Average Price</span>
                <span className="text-lg font-semibold flex items-center">
                  <IndianRupee size={16} className="mr-1" />
                  {averagePrice.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
          
          {stocks.slice(0, 2).map((stock) => (
            <div key={stock.id} className="card">
              <h3 className="text-xl font-semibold mb-1">{stock.company}</h3>
              <p className="text-gray-600 text-sm mb-4">Stock Performance</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="mb-1 text-gray-600 text-sm">Share Price</div>
                  <div className="flex items-center">
                    <IndianRupee size={14} className="mr-1" />
                    <span className="text-lg font-semibold">{stock.sharePrice}</span>
                    {stock.trend === 'up' ? (
                      <TrendingUp size={16} className="ml-2 text-green-500" />
                    ) : stock.trend === 'down' ? (
                      <TrendingDown size={16} className="ml-2 text-red-500" />
                    ) : null}
                  </div>
                </div>
                <div>
                  <div className="mb-1 text-gray-600 text-sm">Available Shares</div>
                  <div className="text-lg font-semibold">{stock.availableShares}</div>
                </div>
                <div>
                  <div className="mb-1 text-gray-600 text-sm">Total Shares Value</div>
                  <div className="flex items-center">
                    <IndianRupee size={14} className="mr-1" />
                    <span className="text-lg font-semibold">{stock.totalSharesValue}</span>
                  </div>
                </div>
                <div>
                  <div className="mb-1 text-gray-600 text-sm">Market Value</div>
                  <div className="flex items-center">
                    <IndianRupee size={14} className="mr-1" />
                    <span className="text-lg font-semibold">{stock.marketValue}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div className="flex space-x-4">
                <button className="text-sebba-blue font-medium border-b-2 border-sebba-blue px-1 py-2">
                  Stocks
                </button>
                <button className="text-gray-500 hover:text-gray-700 px-1 py-2">
                  Company Details
                </button>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Share Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Available Shares
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Shares Value
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Market Value
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stocks.map((stock) => (
                  <tr key={stock.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{stock.company}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <IndianRupee size={14} className="mr-1" />
                        {stock.sharePrice}
                        {stock.trend === 'up' ? (
                          <TrendingUp size={16} className="ml-2 text-green-500" />
                        ) : stock.trend === 'down' ? (
                          <TrendingDown size={16} className="ml-2 text-red-500" />
                        ) : null}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {stock.availableShares}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <IndianRupee size={14} className="mr-1" />
                        {stock.totalSharesValue}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <IndianRupee size={14} className="mr-1" />
                        {stock.marketValue}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketOverview;
