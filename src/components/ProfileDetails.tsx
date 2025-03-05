
import { User, IndianRupee } from 'lucide-react';

interface Stock {
  id: number;
  company: string;
  sharePrice: number;
  availableShares: number;
}

const ProfileDetails = () => {
  const userEmail = "user@gmail.com";
  const totalPortfolioValue = 300;
  const numberOfStocks = 1;
  
  const stocks: Stock[] = [
    {
      id: 1,
      company: "Mahindra & Mahindra",
      sharePrice: 3,
      availableShares: 100
    }
  ];

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start gap-6 mb-10">
          <div className="h-24 w-24 bg-gray-200 rounded-full flex items-center justify-center">
            <User size={40} className="text-gray-500" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold mb-1">Profile</h1>
            <p className="text-gray-600">{userEmail}</p>
            <div className="mt-4">
              <button className="btn-secondary text-sm">Portfolio</button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="card">
            <h3 className="text-xl font-semibold mb-6">Total Portfolio Value</h3>
            <div className="flex items-center">
              <IndianRupee size={24} className="mr-2 text-sebba-blue" />
              <span className="text-3xl font-bold">{totalPortfolioValue}</span>
            </div>
          </div>
          
          <div className="card">
            <h3 className="text-xl font-semibold mb-6">Number of Stocks</h3>
            <div className="text-3xl font-bold">{numberOfStocks}</div>
          </div>
        </div>
        
        <div className="mb-4">
          <h3 className="text-xl font-semibold">Your Stocks</h3>
        </div>
        
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Share Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Available Shares
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
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
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {stock.availableShares}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded">
                      Sell
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
