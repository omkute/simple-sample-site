import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 pt-10 pb-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="mb-4">
              <Link to="/" className="text-xl font-bold text-sebba-blue">SEBBA</Link>
            </div>
            <p className="text-sm text-gray-600 max-w-md">
              The Stock Exchange Board of BizSpark AEC. Empowering Student Entrepreneurs, Enabling Smart Trading.
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-900 mb-4">
              QUICK LINKS
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/market" className="text-gray-600 hover:text-sebba-blue text-sm transition-colors">
                  Market
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-600 hover:text-sebba-blue text-sm transition-colors">
                  -
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-sebba-blue text-sm transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-900 mb-4">
              RESOURCES
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="text-gray-600 hover:text-sebba-blue text-sm transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-sebba-blue text-sm transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-sebba-blue text-sm transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-900 mb-4">
              CONTACT
            </h4>
            <ul className="space-y-2">
              <li className="text-gray-600 text-sm">
                Email: support@sebba.com
              </li>
              <li className="text-gray-600 text-sm">
                Phone: +91 9356678846
              </li>
              <li className="text-gray-600 text-sm">
                Address: AEC Campus
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-center text-sm text-gray-600">
            &copy; {currentYear} SEBBA. All rights reserved.
          </p>
          <p className="text-center text-sm text-gray-600 mt-2">
            Designed and Developed by 
            <a href='https://www.linkedin.com/in/om-kute-a97014196/' target='_blank' className="text-sebba-blue hover:underline ml-1">Om</a> & 
            <a href='https://www.linkedin.com/in/k-aditya29/' target='_blank' className="text-sebba-blue hover:underline ml-1">Aditya</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
