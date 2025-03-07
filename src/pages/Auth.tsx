
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '@/components/AuthForm';
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/profile');
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-sebba-lightgray flex items-center justify-center p-4">
      <AuthForm />
    </div>
  );
};

export default Auth;
