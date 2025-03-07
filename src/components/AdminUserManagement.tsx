
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Users, Wallet, RefreshCw } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  role: 'admin' | 'company' | 'user';
  wallet_balance: number;
}

const AdminUserManagement = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [depositAmount, setDepositAmount] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      setRefreshing(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setUsers(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to fetch users",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDepositChange = (id: string, value: string) => {
    setDepositAmount({
      ...depositAmount,
      [id]: value
    });
  };

  const handleDeposit = async (userId: string) => {
    const amount = parseFloat(depositAmount[userId] || '0');
    
    if (isNaN(amount) || amount <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid amount",
        description: "Please enter a valid positive amount",
      });
      return;
    }
    
    try {
      // Start a transaction to update the user's wallet balance
      const { data: user, error: fetchError } = await supabase
        .from('profiles')
        .select('wallet_balance')
        .eq('id', userId)
        .single();
      
      if (fetchError) throw fetchError;
      
      const newBalance = (user?.wallet_balance || 0) + amount;
      
      // Update the wallet balance
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ wallet_balance: newBalance })
        .eq('id', userId);
      
      if (updateError) throw updateError;
      
      // Record the transaction
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: userId,
          amount: amount,
          transaction_type: 'deposit',
          description: 'Admin deposit'
        });
      
      if (transactionError) throw transactionError;
      
      toast({
        title: "Success",
        description: `Deposited $${amount.toFixed(2)} to user's wallet`,
      });
      
      // Clear the input field
      setDepositAmount({
        ...depositAmount,
        [userId]: ''
      });
      
      // Update the local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, wallet_balance: newBalance } : user
      ));
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to deposit funds",
      });
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
        <h2 className="text-xl font-semibold">User Management</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchUsers}
          disabled={refreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw size={16} className={`${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-md">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No users</h3>
          <p className="mt-1 text-sm text-gray-500">
            There are no users registered in the system.
          </p>
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Wallet Balance</TableHead>
                <TableHead className="text-right">Deposit Funds</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div>{user.full_name || 'Anonymous'}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.role === 'admin' && (
                      <Badge className="bg-purple-100 text-purple-800">Admin</Badge>
                    )}
                    {user.role === 'company' && (
                      <Badge className="bg-blue-100 text-blue-800">Company</Badge>
                    )}
                    {user.role === 'user' && (
                      <Badge className="bg-gray-100 text-gray-800">User</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Wallet size={16} className="mr-2 text-gray-500" />
                      ${user.wallet_balance.toFixed(2)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Input
                        type="number"
                        placeholder="Amount"
                        value={depositAmount[user.id] || ''}
                        onChange={(e) => handleDepositChange(user.id, e.target.value)}
                        className="w-24"
                        min="0"
                        step="0.01"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeposit(user.id)}
                        disabled={!depositAmount[user.id]}
                      >
                        Deposit
                      </Button>
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

export default AdminUserManagement;
