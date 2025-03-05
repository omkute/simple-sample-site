
import { CheckCircle } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      title: "Register Your Company",
      description: "Create a company profile and list your stocks for trading."
    },
    {
      title: "Trade Stocks",
      description: "Buy and sell stocks in real-time with secure transactions."
    },
    {
      title: "Live Market Updates",
      description: "Stay informed with real-time market updates and analytics."
    },
    {
      title: "Fair & Transparent",
      description: "Every trade is securely recorded with complete transparency."
    }
  ];

  return (
    <section className="py-16 bg-sebba-lightgray">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">How It Works?</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="card card-hover animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 text-sebba-blue">
                  <CheckCircle size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
