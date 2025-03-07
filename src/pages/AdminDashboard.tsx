
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdminCompanyApproval from '@/components/AdminCompanyApproval';
import AdminUserManagement from '@/components/AdminUserManagement';
import AdminTransactions from '@/components/AdminTransactions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/hooks/useAuth';
import { AlertCircle } from 'lucide-react';

const AdminDashboard = () => {
  const { profile, loading } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Check if user is admin
    if (!loading && profile) {
      if (profile.role !== 'admin') {
        // Redirect non-admin users
        navigate('/');
      } else {
        setIsAdmin(true);
      }
    }
  }, [profile, loading, navigate]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow bg-sebba-lightgray p-6">
          <div className="container mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow bg-sebba-lightgray p-6">
          <div className="container mx-auto">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    You don't have permission to access this page.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-sebba-lightgray p-6">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
          
          <Tabs defaultValue="companies" className="bg-white rounded-lg shadow-md p-6">
            <TabsList className="mb-6">
              <TabsTrigger value="companies">Company Approvals</TabsTrigger>
              <TabsTrigger value="users">User Management</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="companies">
              <AdminCompanyApproval />
            </TabsContent>
            
            <TabsContent value="users">
              <AdminUserManagement />
            </TabsContent>
            
            <TabsContent value="transactions">
              <AdminTransactions />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
