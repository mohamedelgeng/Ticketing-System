import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchFilter } from '../../context/SearchFilterContext';
import { ROUTES } from '../../constants/routes';

function Navbar({ locations, categories }) {
  const { user, isAuthenticated, logout } = useUser();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { searchTerm, setSearchTerm } = useSearchFilter();
  const searchContainerRef = useRef(null);

  const handleLogout = async () => {
    try {
      await logout();
      navigate(ROUTES.HOME);
    } catch (error) {
      navigate(ROUTES.HOME);
    }
  };

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.nav 
      initial="hidden"
      animate="visible"
      variants={navVariants}
      className={`fixed top-4 w-full px-8 py-4 shadow-lg ${isDarkMode ? 'backdrop-blur-sm' : 'backdrop-blur-md'} z-50 ${isDarkMode ? 'bg-gradient-to-r from-gray-800 via-gray-900 to-black bg-opacity-90' : 'bg-gradient-to-r from-white via-yellow-50 to-white bg-opacity-90'} transition-colors duration-200 rounded-full`}
    >
      <div className="flex justify-between items-center w-full">
        <motion.div 
          className="flex items-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link to="/" className={`text-xl font-serif font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800 hover:text-yellow-500 transition'}`}>
            ExperienceLive
          </Link>
        </motion.div>

        <div 
          className="hidden md:flex items-center flex-grow justify-center px-8 relative"
          ref={searchContainerRef}
        >
          <div className="relative w-full max-w-md">
            <input 
              type="text" 
              placeholder="Search events..."
              className="w-full px-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={(e) => {
                setTimeout(() => {
                  if (searchContainerRef.current && !searchContainerRef.current.contains(e.relatedTarget)) {
                    setIsSearchFocused(false);
                  }
                }, 100);
              }}
            />
            <svg className="w-5 h-5 text-gray-500 dark:text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          <Link 
            to="/"
            className={`text-gray-800 dark:text-white hover:text-yellow-500 transition-all duration-300 font-medium`}
          >
            Events
          </Link>

          {isAuthenticated && user?.role === 'admin' && (
            <>
              <Link
                to="/admin/dashboard"
                className={`text-gray-800 dark:text-white hover:text-yellow-500 transition-all duration-300 font-medium`}
              >
                Admin Dashboard
              </Link>
              <Link
                to="/admin/events"
                className={`text-gray-800 dark:text-white hover:text-yellow-500 transition-all duration-300 font-medium`}
              >
                Manage Events
              </Link>
            </>
          )}

          {isAuthenticated && user?.role === 'organizer' && (
            <Link
              to="/organizer/events"
              className={`text-gray-800 dark:text-white hover:text-yellow-500 transition-all duration-300 font-medium`}
            >
              My Events
            </Link>
          )}

          {isAuthenticated && user?.role === 'user' && (
            <Link
              to="/bookings"
              className={`text-gray-800 dark:text-white hover:text-yellow-500 transition-all duration-300 font-medium`}
            >
              My Bookings
            </Link>
          )}

          {!isAuthenticated ? (
            <>
              <Link
                to={ROUTES.LOGIN}
                className="px-4 py-2 text-gray-800 dark:text-white hover:text-yellow-500 transition-all duration-300 font-medium"
              >
                Login
              </Link>
              <Link
                to={ROUTES.REGISTER}
                className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-600 transition-all duration-300 font-medium"
              >
                Register
              </Link>
            </>
          ) : (
            <div className="relative">
              <motion.button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center space-x-2 text-gray-800 dark:text-white hover:text-yellow-500 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="font-medium">{user.name}</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </motion.button>

              <AnimatePresence>
                {isProfileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50"
                  >
                    <Link
                      to={ROUTES.PROFILE}
                      className="block px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        to={ROUTES.ADMIN.DASHBOARD}
                        className="block px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    {user.role === 'organizer' && (
                      <Link
                        to={ROUTES.ORGANIZER.EVENTS}
                        className="block px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        My Events
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          <motion.button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? (
              <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </motion.button>
        </div>

        <div className="md:hidden flex items-center space-x-2">
          <motion.button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? (
              <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </motion.button>

          <motion.button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
            whileTap={{ scale: 0.95 }}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </motion.button>
        </div>
      </div>

      <div className="md:hidden overflow-hidden bg-white dark:bg-gray-800 shadow-inner relative z-50">
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={navVariants}
              className="pt-2 pb-3 space-y-1 overflow-y-auto"
            >
              <div className="flex flex-col space-y-2">
                <Link 
                  to="/"
                  className={`block w-full px-4 py-2 text-gray-700 dark:text-white hover:text-yellow-500 transition-all duration-300`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Events
                </Link>

                {!isAuthenticated ? (
                  <>
                    <Link
                      to={ROUTES.LOGIN}
                      className="block w-full px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to={ROUTES.REGISTER}
                      className="block w-full px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-600"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Register
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to={ROUTES.PROFILE}
                      className="block w-full px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        to={ROUTES.ADMIN.DASHBOARD}
                        className="block w-full px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    {user.role === 'organizer' && (
                      <Link
                        to={ROUTES.ORGANIZER.EVENTS}
                        className="block w-full px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        My Events
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}

export default Navbar;