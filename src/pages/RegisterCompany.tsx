
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RegisterCompanyForm from '@/components/RegisterCompanyForm';

const RegisterCompany = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-sebba-lightgray py-12">
        <RegisterCompanyForm />
      </main>
      <Footer />
    </div>
  );
};

export default RegisterCompany;
