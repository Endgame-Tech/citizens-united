
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import TopLogo from '../../../components/TopLogo';
import { LayoutDashboard } from 'lucide-react';
import { useUser } from '../../../context/UserContext';

const LandingNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { profile, isLoading } = useUser();

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
        }`}
    >
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
        {/* Left side - Logo */}
        <div className="flex items-center gap-8">
          <TopLogo />

          {/* Nav Links - Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#understand" className="text-gray-700 hover:text-green-700 transition-colors font-light">Understand</a>
            <a href="#organise" className="text-gray-700 hover:text-green-700 transition-colors font-light">Organise</a>
            <a href="#track" className="text-gray-700 hover:text-green-700 transition-colors font-light">Track</a>
            <a href="#get-started" className="text-gray-700 hover:text-green-700 transition-colors font-light">Get Started</a>
          </nav>
        </div>

        {/* Right side - Auth buttons or Dashboard link */}
        <div className="flex items-center gap-4">
          {isLoading ? (
            // Loading state - show skeleton
            <div className="flex gap-3">
              <div className="w-20 h-9 bg-gray-200 rounded-md animate-pulse"></div>
              <div className="w-20 h-9 bg-gray-200 rounded-md animate-pulse"></div>
            </div>
          ) : profile ? (
            // Logged in - show dashboard button
            <Link
              to="/dashboard"
              className="flex items-center gap-2 py-2 px-4 rounded-lg bg-green-700 hover:bg-green-800 text-white transition-colors"
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </Link>
          ) : (
            // Not logged in - show login & register
            <>
              <Link
                to="/auth/login"
                className="py-2 px-4 rounded-lg border border-green-700 text-green-700 hover:bg-green-50 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/auth/sign-up"
                className="py-2 px-4 rounded-lg bg-green-700 hover:bg-green-800 text-white transition-colors"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default LandingNavbar;