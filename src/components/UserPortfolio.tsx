
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/hooks/useAuth';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IndianRupee, TrendingUp, TrendingDown } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface StockHolding {
  id: string;
  company_id: string;
  company_name: string;
  shares: number;
  purchase_price: number;
  current_price: number;
  profit_loss: number;
  profit_loss_percent: number;
}

const UserPortfolio = () => {
  const [holdings, setHoldings] = useState<StockHolding[]>([]);
  const [loading, setLoading] = useState(true);
  const [sellDialog, setSellDialog] = useState(false);
  const [selectedHolding, setSelectedHolding] = useState<StockHolding | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [totalValue, setTotalValue] = useState(0);
  const { profile, loading: profileLoading } = useAuth();
  const { toast } = useToast();

  const fetchHoldings = async () => {
    if (!profile) return;

    try {
      setLoading(true);
      
      // Get user's stock holdings along with company information
      const { data: stocksData, error: stocksError } = await supabase
        .from('stocks')
        .select(`
          id,
          shares,
          purchase_price,
          company_id,
          companies:company_id (
            name,
            current_price
          )
        `)
        .eq('user_id', profile.id);
      
      if (stocksError) throw stocksError;
      
      // Transform the data to match the StockHolding interface
      const holdingsData = (stocksData || []).map(stock => {
        const currentPrice = stock.companies?.current_price || 0;
        const profitLoss = (currentPrice - stock.purchase_price) * stock.shares;
        const profitLossPercent = stock.purchase_price > 0 
          ? ((currentPrice - stock.purchase_price) / stock.purchase_price) * 100 
          : 0;
        
        return {
          id: stock.id,
          company_id: stock.company_id,
          company_name: stock.companies?.name || 'Unknown Company',
          shares: stock.shares,
          purchase_price: stock.purchase_price,
          current_price: currentPrice,
          profit_loss: profitLoss,
          profit_loss_percent: profitLossPercent
        };
      });
      
      setHoldings(holdingsData);
    } catch (error) {
      console.error('Error fetching holdings:', error);
      toast({
        title: "Error",
        description: "Failed to fetch your stock holdings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profile && !profileLoading) {
      fetchHoldings();
    }
  }, [profile, profileLoading]);

  useEffect(() => {
    if (selectedHolding && quantity > 0) {
      setTotalValue(selectedHolding.current_price * quantity);
    } else {
      setTotalValue(0);
    }
  }, [selectedHolding, quantity]);

  const handleSellClick = (holding: StockHolding) => {
    setSelectedHolding(holding);
    setQuantity(1);
    setSellDialog(true);
  };

  const handleSellConfirm = async () => {
    if (!selectedHolding || !profile) return;
    
    if (quantity <= 0) {
      toast({
        title: "Invalid Quantity",
        description: "Please enter a positive number of shares",
        variant: "destructive",
      });
      return;
    }
    
    if (selectedHolding.shares < quantity) {
      toast({
        title: "Not Enough Shares",
        description: "You don't have enough shares to sell",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Get the company information first to ensure it exists
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .select('available_shares')
        .eq('id', selectedHolding.company_id)
        .single();
      
      if (companyError) throw companyError;
      
      // Start a transaction in Supabase
      // 1. Update user wallet balance
      const saleAmount = selectedHolding.current_price * quantity;
      const { error: walletError } = await supabase
        .from('profiles')
        .update({ wallet_balance: profile.wallet_balance + saleAmount })
        .eq('id', profile.id);
      
      if (walletError) throw walletError;
      
      // 2. Update company available shares
      const { error: sharesError } = await supabase
        .from('companies')
        .update({ available_shares: (company.available_shares || 0) + quantity })
        .eq('id', selectedHolding.company_id);
      
      if (sharesError) throw sharesError;
      
      // 3. Update user's stock holdings
      if (selectedHolding.shares === quantity) {
        // If selling all shares, delete the record
        const { error: deleteError } = await supabase
          .from('stocks')
          .delete()
          .eq('id', selectedHolding.id);
        
        if (deleteError) throw deleteError;
      } else {
        // If selling some shares, update the record
        const { error: updateError } = await supabase
          .from('stocks')
          .update({ shares: selectedHolding.shares - quantity })
          .eq('id', selectedHolding.id);
        
        if (updateError) throw updateError;
      }
      
      // 4. Record the transaction
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: profile.id,
          amount: saleAmount,
          transaction_type: 'sell',
          description: `Sold ${quantity} shares of ${selectedHolding.company_name}`,
          company_id: selectedHolding.company_id,
          shares: quantity,
          price_per_share: selectedHolding.current_price
        });
      
      if (transactionError) throw transactionError;
      
      toast({
        title: "Sale Successful",
        description: `You have sold ${quantity} shares of ${selectedHolding.company_name} for ₹${saleAmount.toFixed(2)}`,
      });
      
      // Refresh the holdings
      fetchHoldings();
      
      // Close the dialog
      setSellDialog(false);
      
    } catch (error: any) {
      console.error('Error during sale:', error);
      toast({
        title: "Transaction Failed",
        description: error.message || "An error occurred during the sale",
        variant: "destructive",
      });
    }
  };

  const totalInvestment = holdings.reduce((total, holding) => total + (holding.purchase_price * holding.shares), 0);
  const currentValue = holdings.reduce((total, holding) => total + (holding.current_price * holding.shares), 0);
  const totalProfitLoss = currentValue - totalInvestment;
  const profitLossPercent = totalInvestment > 0 ? (totalProfitLoss / totalInvestment) * 100 : 0;

  if (loading || profileLoading) {
    return (
      <div className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold mb-6">Your Portfolio</h2>
          <div className="animate-pulse space-y-4">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Portfolio Not Available</h2>
            <p className="text-gray-600 mb-4">Please log in to view your portfolio.</p>
            <Button variant="default" onClick={() => window.location.href = '/auth'}>
              Log In
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold mb-6">Your Portfolio</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <h3 className="text-gray-600 text-sm mb-2">Total Investment</h3>
            <div className="flex items-center">
              <IndianRupee size={20} className="mr-1" />
              <span className="text-2xl font-bold">{totalInvestment.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="card">
            <h3 className="text-gray-600 text-sm mb-2">Current Value</h3>
            <div className="flex items-center">
              <IndianRupee size={20} className="mr-1" />
              <span className="text-2xl font-bold">{currentValue.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="card">
            <h3 className="text-gray-600 text-sm mb-2">Profit/Loss</h3>
            <div className="flex items-center">
              <IndianRupee size={20} className="mr-1" />
              <span className={`text-2xl font-bold ${totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totalProfitLoss.toFixed(2)}
              </span>
              <span className={`ml-2 flex items-center text-sm ${totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totalProfitLoss >= 0 ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
                {Math.abs(profitLossPercent).toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
        
        {holdings.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900">No Stocks Yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              You haven't purchased any stocks yet. Visit the market to start investing.
            </p>
            <div className="mt-6">
              <Button variant="default" onClick={() => window.location.href = '/market'}>
                Go to Market
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Your Stock Holdings</h3>
            </div>
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Shares</TableHead>
                    <TableHead>Purchase Price</TableHead>
                    <TableHead>Current Price</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Profit/Loss</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {holdings.map((holding) => (
                    <TableRow key={holding.id}>
                      <TableCell className="font-medium">{holding.company_name}</TableCell>
                      <TableCell>{holding.shares}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <IndianRupee size={14} className="mr-1" />
                          {holding.purchase_price.toFixed(2)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <IndianRupee size={14} className="mr-1" />
                          {holding.current_price.toFixed(2)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <IndianRupee size={14} className="mr-1" />
                          {(holding.current_price * holding.shares).toFixed(2)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className={holding.profit_loss >= 0 ? 'text-green-600' : 'text-red-600'}>
                            <IndianRupee size={14} className="mr-1 inline" />
                            {holding.profit_loss.toFixed(2)}
                          </span>
                          <span className={`ml-2 text-xs ${holding.profit_loss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {holding.profit_loss >= 0 ? <TrendingUp size={12} className="inline mr-1" /> : <TrendingDown size={12} className="inline mr-1" />}
                            {Math.abs(holding.profit_loss_percent).toFixed(2)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleSellClick(holding)}
                        >
                          Sell
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
        
        {/* Sell Dialog */}
        <Dialog open={sellDialog} onOpenChange={setSellDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Sell Shares</DialogTitle>
              <DialogDescription>
                {selectedHolding && (
                  <div className="py-2">
                    <p className="font-medium">{selectedHolding.company_name}</p>
                    <p className="text-sm text-gray-600 flex items-center mt-1">
                      Current price: <IndianRupee size={14} className="mx-1" /> {selectedHolding.current_price} per share
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      You own: {selectedHolding.shares} shares
                    </p>
                  </div>
                )}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="quantity" className="text-right">
                  Quantity
                </label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  max={selectedHolding?.shares || 1}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                  className="col-span-3"
                />
              </div>
              
              <div className="flex justify-between items-center border-t border-b py-2 my-2">
                <span>Total Value:</span>
                <span className="font-semibold flex items-center">
                  <IndianRupee size={16} className="mr-1" />
                  {totalValue.toFixed(2)}
                </span>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setSellDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSellConfirm}>
                Confirm Sale
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default UserPortfolio;
