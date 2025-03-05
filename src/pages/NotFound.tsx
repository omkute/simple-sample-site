
import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow flex items-center justify-center bg-sebba-lightgray py-24">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-6xl font-bold text-sebba-blue mb-6">404</h1>
          <p className="text-xl text-gray-600 mb-8">Oops! Page not found</p>
          <Link to="/" className="btn-primary rounded-full px-6 py-3 inline-block">
            Return to Home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
