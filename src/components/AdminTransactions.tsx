import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { RefreshCw, IndianRupee, CreditCard } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import * as XLSX from 'xlsx'; // Add this import

interface Stock {
  id: string;
  user_id: string;
  company_id: string | null;
  shares: number;
  purchase_price: number;
  created_at: string;
  updated_at: string;
}

interface Transaction {
  id: string;
  user_id: string;
  user_email: string;
  user_name: string;
  amount: number;
  transaction_type: string;
  description: string;
  created_at: string;
  company_id: string | null;
  company_name: string | null;
  shares: number | null;
  price_per_share: number | null;
}

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  const fetchTransactions = async () => {
    try {
      setRefreshing(true);
      
      // Fetch stocks with user and company details
      const { data, error } = await supabase
        .from('stocks')
        .select(`
          *,
          profiles:user_id (email, full_name),
          companies:company_id (name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform the data
      const transformedData = (data || []).map(stock => ({
        id: stock.id,
        user_id: stock.user_id,
        user_email: stock.profiles?.email || 'Unknown',
        user_name: stock.profiles?.full_name || 'Unknown User',
        amount: stock.shares * stock.purchase_price,
        transaction_type: 'stock',
        description: `Purchased ${stock.shares} shares`,
        created_at: stock.created_at,
        company_id: stock.company_id,
        company_name: stock.companies?.name || null,
        shares: stock.shares,
        price_per_share: stock.purchase_price
      }));
      
      setTransactions(transformedData);
      console.log(transactions);
    } catch (error: any) {
      console.error('Error fetching transactions:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to fetch transactions",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const downloadExcel = () => {
    const transformedData = transactions.map(({ id, user_id, company_id, ...rest }) => rest);
    const worksheet = XLSX.utils.json_to_sheet(transformedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
    XLSX.writeFile(workbook, "transactions.xlsx");
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Get transaction type badge
  const getTransactionBadge = (type: string) => {
    switch (type) {
      case 'stock':
        return <Badge className="bg-green-100 text-green-800">Stock</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{type}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Transaction History</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchTransactions}
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw size={16} className={`${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={downloadExcel}
            className="flex items-center gap-2"
          >
            Download Excel
          </Button>
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-md">
          <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No transactions</h3>
          <p className="mt-1 text-sm text-gray-500">
            There are no transactions recorded in the system.
          </p>
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="whitespace-nowrap">
                    {formatDate(transaction.created_at)}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{transaction.user_name}</div>
                      <div className="text-xs text-gray-500">{transaction.user_email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getTransactionBadge(transaction.transaction_type)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center font-medium">
                      <IndianRupee size={14} className="mr-1" />
                      {transaction.amount.toFixed(2)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      {transaction.description}
                      {transaction.company_name && (
                        <div className="text-xs text-gray-600 mt-1">
                          Company: {transaction.company_name}
                        </div>
                      )}
                      {transaction.shares && transaction.price_per_share && (
                        <div className="text-xs text-gray-600">
                          {transaction.shares} shares @ <IndianRupee size={10} className="inline" />
                          {transaction.price_per_share.toFixed(2)} per share
                        </div>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AdminTransactions;
