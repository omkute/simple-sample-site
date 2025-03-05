
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="py-16 md:py-24 bg-sebba-blue text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 animate-fade-in">
            Welcome to SEBBA
          </h1>
          <p className="text-xl sm:text-2xl mb-6 text-blue-100 animate-fade-in" style={{ animationDelay: '200ms' }}>
            The Stock Exchange Board of BizSpark AEC
          </p>
          <p className="text-lg mb-10 text-blue-100 animate-fade-in" style={{ animationDelay: '400ms' }}>
            Empowering Student Entrepreneurs, Enabling Smart Trading
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in" style={{ animationDelay: '600ms' }}>
            <Link 
              to="/register" 
              className="btn bg-white text-sebba-blue hover:bg-opacity-90 px-6 py-3 rounded-full font-medium shadow-sm"
            >
              Register Company
            </Link>
            <a 
               href="https://forms.gle/ZsREE7ncc5dCS3fY8" 
               target="_blank" 
              className="btn bg-transparent text-white border border-white hover:bg-white hover:bg-opacity-10 px-6 py-3 rounded-full font-medium"
            >
              Start Trading
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
