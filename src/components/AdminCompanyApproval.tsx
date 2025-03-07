
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, XCircle, Briefcase, RefreshCw } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Company {
  id: string;
  name: string;
  founder_name: string;
  email: string;
  phone: string;
  industry: string;
  description: string;
  initial_shares: number;
  share_price: number;
  is_approved: boolean | null;
  created_at: string | null;
}

const AdminCompanyApproval = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  const fetchCompanies = async () => {
    try {
      setRefreshing(true);
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setCompanies(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to fetch companies",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      const { error } = await supabase
        .from('companies')
        .update({ is_approved: true })
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Company has been approved",
      });
      
      // Update the local state
      setCompanies(companies.map(company => 
        company.id === id ? { ...company, is_approved: true } : company
      ));
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to approve company",
      });
    }
  };

  const handleReject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('companies')
        .update({ is_approved: false })
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Company has been rejected",
      });
      
      // Update the local state
      setCompanies(companies.map(company => 
        company.id === id ? { ...company, is_approved: false } : company
      ));
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to reject company",
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
        <h2 className="text-xl font-semibold">Company Approval Requests</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchCompanies}
          disabled={refreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw size={16} className={`${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {companies.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-md">
          <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No companies</h3>
          <p className="mt-1 text-sm text-gray-500">
            There are no company registration requests at the moment.
          </p>
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Founder</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>Shares</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div>{company.name}</div>
                      <div className="text-xs text-gray-500">{company.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{company.founder_name}</TableCell>
                  <TableCell>{company.industry}</TableCell>
                  <TableCell>
                    <div>
                      <div>{company.initial_shares} shares</div>
                      <div className="text-xs text-gray-500">${company.share_price}/share</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {company.is_approved === true && (
                      <Badge variant="default" className="bg-green-100 text-green-800">Approved</Badge>
                    )}
                    {company.is_approved === false && (
                      <Badge variant="destructive" className="bg-red-100 text-red-800">Rejected</Badge>
                    )}
                    {company.is_approved === null && (
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {company.is_approved !== true && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="h-8 w-8 p-0 text-green-600"
                          onClick={() => handleApprove(company.id)}
                        >
                          <CheckCircle size={16} />
                          <span className="sr-only">Approve</span>
                        </Button>
                      )}
                      
                      {company.is_approved !== false && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="h-8 w-8 p-0 text-red-600"
                          onClick={() => handleReject(company.id)}
                        >
                          <XCircle size={16} />
                          <span className="sr-only">Reject</span>
                        </Button>
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

export default AdminCompanyApproval;
