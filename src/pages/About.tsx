
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EventDetails from '@/components/EventDetails';

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-sebba-lightgray">
        <EventDetails />
      </main>
      <Footer />
    </div>
  );
};

export default About;
