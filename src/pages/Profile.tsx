
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProfileDetails from '@/components/ProfileDetails';

const Profile = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-sebba-lightgray">
        <ProfileDetails />
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
