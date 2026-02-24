import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

// Components
import HeroSection from '../components/Home/HeroSection';
import PlacementStats from '../components/Home/PlacementStats';
import TopRecruiters from '../components/Home/TopRecruiters';
import HowItWorks from '../components/Home/HowItWorks';
import UpcomingDrives from '../components/Home/UpcomingDrives';
import Testimonials from '../components/Home/Testimonials';
import PlacementChart from '../components/Home/PlacementChart';
import Features from '../components/Home/Features';
import NoticeBoard from '../components/Home/NoticeBoard';
import FAQSection from '../components/Home/FAQSection';
import ContactSection from '../components/Home/ContactSection';
import Footer from '../components/Footer';

export default function Home() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">

      {/* Navigation Bar (Inline for now, could be extracted) */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                Placement<span className="text-gray-700">Cell</span>
              </span>
            </div>
            <div className="flex items-center space-x-4">
              {!user ? (
                <>
                  <button
                    onClick={() => navigate('/login')}
                    className="text-gray-600 hover:text-blue-600 font-medium px-3 py-2 transition-colors hidden sm:block"
                  >
                    Student Login
                  </button>
                  <button
                    onClick={() => navigate('/register')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-medium shadow-md transition-all hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    Register
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    if (user?.role === 'admin') navigate('/admin');
                    else if (user?.role === 'recruiter') navigate('/recruiter');
                    else if (user?.role === 'coordinator') navigate('/coordinator');
                    else navigate('/student');
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-full font-medium shadow-md transition-all"
                >
                  Dashboard
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        {/* 1. Hero Section */}
        <HeroSection user={user} />

        {/* 2. Placement Highlights */}
        <PlacementStats />

        {/* 3. Top Recruiters */}
        <TopRecruiters />

        {/* 4. How It Works */}
        <HowItWorks />

        {/* 5. Upcoming Drives */}
        <UpcomingDrives />

        {/* 6. Success Stories / Testimonials */}
        <Testimonials />

        {/* 7. Department-wise Placement Chart */}
        <PlacementChart />

        {/* 8. Features Section */}
        <Features />

        {/* 9. Announcement / Notice Board */}
        <NoticeBoard />

        {/* 10. FAQ Section */}
        <FAQSection />

        {/* 11. Contact Placement Cell */}
        <ContactSection />
      </main>

      {/* 12. Footer */}
      <Footer />
    </div>
  );
}
