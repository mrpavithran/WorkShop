import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LogOut, 
  User, 
  Settings, 
  Calendar, 
  PlusCircle,
  Menu,
  X
} from 'lucide-react';

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Calendar className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">WorkshopHub</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/workshops" 
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              Browse Workshops
            </Link>
            
            {user ? (
              <>
                {user.role === 'creator' ? (
                  <>
                    <Link 
                      to="/creator/dashboard" 
                      className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/creator/create" 
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
                    >
                      <PlusCircle className="h-4 w-4" />
                      <span>Create Workshop</span>
                    </Link>
                  </>
                ) : (
                  <Link 
                    to="/profile" 
                    className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
                  >
                    My Profile
                  </Link>
                )}
                
                <div className="flex items-center space-x-3">
                  <span className="text-gray-700">Hi, {user.name}</span>
                  <button 
                    onClick={handleLogout}
                    className="text-gray-500 hover:text-red-600 transition-colors duration-200"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-2 space-y-2">
            <Link 
              to="/workshops" 
              onClick={closeMobileMenu}
              className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
            >
              Browse Workshops
            </Link>
            
            {user ? (
              <>
                {user.role === 'creator' ? (
                  <>
                    <Link 
                      to="/creator/dashboard" 
                      onClick={closeMobileMenu}
                      className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/creator/create" 
                      onClick={closeMobileMenu}
                      className="block px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      Create Workshop
                    </Link>
                  </>
                ) : (
                  <Link 
                    to="/profile" 
                    onClick={closeMobileMenu}
                    className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                  >
                    My Profile
                  </Link>
                )}
                
                <div className="px-3 py-2 text-gray-700">
                  Hi, {user.name}
                </div>
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  onClick={closeMobileMenu}
                  className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  onClick={closeMobileMenu}
                  className="block px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;