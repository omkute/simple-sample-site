
import { useNavigate } from 'react-router-dom';
import { User, IndianRupee, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import UserPortfolio from './UserPortfolio';

const ProfileDetails = () => {
  const { profile, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to log out. Please try again.",
      });
    } else {
      navigate('/auth');
    }
  };

  if (loading) {
    return (
      <div className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-24 w-24 bg-gray-200 rounded-full mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start gap-6 mb-10">
          <div className="h-24 w-24 bg-gray-200 rounded-full flex items-center justify-center">
            <User size={40} className="text-gray-500" />
          </div>
          <div className="flex-grow">
            <h1 className="text-2xl font-semibold mb-1">{profile.full_name || 'Anonymous'}</h1>
            <p className="text-gray-600">{profile.email}</p>
            <p className="text-gray-600 mt-1">Role: {profile.role}</p>
            <div className="mt-4 flex gap-4">
              <button 
                className="btn-secondary text-sm"
                onClick={() => document.getElementById('portfolio-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Portfolio
              </button>
              <button
                onClick={handleLogout}
                className="btn-secondary text-sm flex items-center text-red-600 hover:text-red-700"
              >
                <LogOut size={16} className="mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="card">
            <h3 className="text-xl font-semibold mb-6">Wallet Balance</h3>
            <div className="flex items-center">
              <IndianRupee size={24} className="mr-2 text-sebba-blue" />
              <span className="text-3xl font-bold">{profile.wallet_balance.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <div id="portfolio-section">
          <UserPortfolio />
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
