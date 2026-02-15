import NewsTicker from '../components/Home/NewsTicker';
import QuoteCard from '../components/Home/QuoteCard';
import AchievementCard from '../components/Home/AchievementCard';
import CompanySpotlight from '../components/Home/CompanySpotlight';
import DailyTip from '../components/Home/DailyTip';
import UpcomingDrives from '../components/Home/UpcomingDrives';
import PollWidget from '../components/Home/PollWidget';
import QuickResources from '../components/Home/QuickResources';
import FAQSection from '../components/Home/FAQSection';
import ContactFloatingButton from '../components/Home/ContactFloatingButton';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                Placement<span className="text-gray-700">Cell</span>
              </span>
            </div>
            <div className="flex items-center space-x-4">
              {!user ? (
                <>
                  <button
                    onClick={() => navigate('/login')}
                    className="text-gray-600 hover:text-blue-600 font-medium px-3 py-2 transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate('/register')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-medium shadow-md transition-all hover:shadow-lg"
                  >
                    Register
                  </button>
                </>
              ) : (
                <button
                  onClick={() => navigate(user?.role === 'coordinator' ? '/coordinator' : '/student')}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-full font-medium shadow-md transition-all"
                >
                  Dashboard
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* 5. News Ticker (Full Width) */}
      <NewsTicker />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            {user ? `Welcome back, ${user.name}! 👋` : 'Welcome to Your Future 🚀'}
          </h1>
          <p className="text-gray-500 mt-1">
            {user ? "Let's get you placed in your dream company." : "Your gateway to top placements and career growth."}
          </p>
        </div>

        {/* Top Grid: Hero Cards */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
          {/* 1. Quote (Left - 4 cols) */}
          <div className="md:col-span-4">
            <QuoteCard />
          </div>

          {/* 8. Achievement (Middle - 4 cols) */}
          <div className="md:col-span-4">
            <AchievementCard />
          </div>

          {/* 2. Company Spotlight (Right - 4 cols) */}
          <div className="md:col-span-4">
            <CompanySpotlight />
          </div>
        </div>

        {/* Middle Grid: Main Content + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Column (Main Content) - 8 cols */}
          <div className="lg:col-span-8 space-y-8">
            {/* 3. Tip of the Day */}
            <DailyTip />

            {/* 7. Quick Resources */}
            <QuickResources />

            {/* 4. Upcoming Drives (If viewed on mobile, might want to stack differently, but here keeping simple) */}
            <div className="block lg:hidden">
              <UpcomingDrives />
            </div>

            {/* 9. FAQ Section */}
            <FAQSection />
          </div>

          {/* Right Column (Sidebar Widgets) - 4 cols */}
          <div className="lg:col-span-4 space-y-6">
            {/* 4. Upcoming Drives (Desktop) */}
            <div className="hidden lg:block">
              <UpcomingDrives />
            </div>

            {/* 6. Poll Widget */}
            <PollWidget />

            {/* CTA to Dashboard */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white text-center shadow-lg">
              <h3 className="font-bold text-xl mb-2">Ready to Apply?</h3>
              <p className="opacity-90 text-sm mb-4">Check the dashboard for more live drives.</p>
              <button
                onClick={() => navigate(user?.role === 'coordinator' ? '/coordinator' : '/student')}
                className="bg-white text-blue-600 px-6 py-2 rounded-full font-bold shadow hover:bg-gray-100 transition-colors w-full"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 10. Contact Shortcut */}
      <ContactFloatingButton />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 border-t border-gray-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Placement<span className="text-blue-500">Cell</span></h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">Empowering students to achieve their dreams through structured placement management.</p>
          <div className="text-sm text-gray-500 border-t border-gray-800 pt-8">
            © 2026 College Placement Cell. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
