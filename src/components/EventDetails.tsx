
import { useState } from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';

const EventDetails = () => {
  const [registered, setRegistered] = useState(false);

  const handleRegister = () => {
    setRegistered(true);
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">BizSpark 2025</h1>
          <p className="text-xl text-center text-gray-600 mb-10">Anantha Engineering College, Chirala</p>
          
          <div className="bg-white rounded-lg shadow-md p-8 mb-10">
            <p className="text-gray-700 mb-8">
              We are excited to invite you to register for a business stall at BizSpark 2025. This is your chance to showcase your entrepreneurial skills and
              have the opportunity to earn money.
            </p>
            
            <div className="mb-10">
              <h3 className="text-xl font-semibold mb-4">Event Details</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Calendar size={20} className="mr-3 text-sebba-blue mt-0.5" />
                  <span>March 5th to March 8th, 2025</span>
                </li>
                <li className="flex items-start">
                  <Clock size={20} className="mr-3 text-sebba-blue mt-0.5" />
                  <span>10:30 AM to 5:30 PM (Every day)</span>
                </li>
                <li className="flex items-start">
                  <MapPin size={20} className="mr-3 text-sebba-blue mt-0.5" />
                  <span>Anantha Engineering College, Chirala</span>
                </li>
              </ul>
            </div>
            
            <div className="flex justify-center">
              {registered ? (
                <div className="bg-green-100 text-green-800 px-5 py-3 rounded-md">
                  Successfully registered! Check your email for confirmation.
                </div>
              ) : (
                <button 
                  onClick={handleRegister}
                  className="btn-primary px-6 items-center py-3 flex rounded-md"
                >
                  Register Now
                </button>
              )}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-8">
            <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="font-medium mb-2">Event Organizer</h4>
                <p className="text-gray-600 text-sm">John Doe</p>
                <p className="text-gray-600 text-sm">john@bizspark.com</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="font-medium mb-2">Technical Support</h4>
                <p className="text-gray-600 text-sm">Jane Smith</p>
                <p className="text-gray-600 text-sm">support@bizspark.com</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="font-medium mb-2">Venue Contact</h4>
                <p className="text-gray-600 text-sm">AEC Campus</p>
                <p className="text-gray-600 text-sm">info@aec.edu</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventDetails;
