import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaChartLine,
  FaDumbbell,
  FaUserCircle,
  FaTachometerAlt,
  FaEnvelope,
  FaUserPlus,
  FaSignInAlt,
  FaTrophy,
} from "react-icons/fa";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [userProfile, setUserProfile] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchUserProfile = useCallback(async () => {
    if (isLoggedIn) {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/user-profile/`,
          {
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
          },
        );
        setUserProfile(response.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    }
  }, [isLoggedIn]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const handleLogout = useCallback(() => {
    logout();
    navigate("/");
  }, [logout, navigate]);

  const navLinks = [
    { to: "/dashboard", text: "Dashboard", icon: FaTachometerAlt },
    { to: "/exercises", text: "Exercises", icon: FaDumbbell },
    { to: "/progress", text: "Progress", icon: FaChartLine },
    { to: "/workout-challenges", text: "Challenges", icon: FaTrophy },
  ];

  return (
    <nav className="app-navbar bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <FaDumbbell className="h-10 w-10 text-white" />
              </motion.div>
              <span className="ml-3 text-white font-bold text-2xl tracking-tight">
                Exercise Tracker
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center text-white hover:bg-blue-500 hover:bg-opacity-50 px-3 py-2 rounded-md text-sm font-medium transition duration-200 ease-in-out ${
                      location.pathname === link.to
                        ? "bg-blue-500 bg-opacity-50"
                        : ""
                    }`}
                  >
                    <link.icon className="mr-2" />
                    {link.text}
                  </Link>
                ))}
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center space-x-2 text-white focus:outline-none"
                  >
                    <img
                      src={
                        userProfile?.profile_picture ||
                        "https://via.placeholder.com/40"
                      }
                      alt="Profile"
                      className="h-8 w-8 rounded-full object-cover border-2 border-white"
                    />
                    <span className="hidden lg:inline-block font-medium">
                      {userProfile?.username}
                    </span>
                  </motion.button>
                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        ref={dropdownRef}
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.1 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10"
                      >
                        <Link
                          to="/profile"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <FaUserCircle className="mr-2" />
                          Profile
                        </Link>
                        <button
                          onClick={() => {
                            handleLogout();
                            setDropdownOpen(false);
                          }}
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <svg
                            className="mr-2 h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/features"
                  className="text-white hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium transition duration-200 ease-in-out"
                >
                  Features
                </Link>
                <Link
                  to="/about"
                  className="text-white hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium transition duration-200 ease-in-out"
                >
                  About
                </Link>
                <Link
                  to="/login"
                  className="text-white hover:bg-blue-500 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition duration-200 ease-in-out border border-white"
                >
                  <FaSignInAlt className="inline-block mr-2" />
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-md text-sm font-bold transition duration-200 ease-in-out shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <FaUserPlus className="inline-block mr-2" />
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-blue-500 hover:bg-opacity-50 focus:outline-none transition duration-200 ease-in-out"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-indigo-700">
              {isLoggedIn ? (
                <>
                  {navLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className="flex items-center text-white hover:bg-blue-600 block px-3 py-2 rounded-md text-base font-medium transition duration-200 ease-in-out"
                      onClick={() => setIsOpen(false)}
                    >
                      <link.icon className="mr-2" />
                      {link.text}
                    </Link>
                  ))}
                  <Link
                    to="/profile"
                    className="flex items-center text-white hover:bg-blue-600 block px-3 py-2 rounded-md text-base font-medium transition duration-200 ease-in-out"
                    onClick={() => setIsOpen(false)}
                  >
                    <FaUserCircle className="mr-2" />
                    Profile
                  </Link>
                  <Link
                    to="/contact"
                    className="flex items-center text-white hover:bg-blue-600 block px-3 py-2 rounded-md text-base font-medium transition duration-200 ease-in-out"
                    onClick={() => setIsOpen(false)}
                  >
                    <FaEnvelope className="mr-2" />
                    Contact Us
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="flex items-center w-full text-left text-white hover:bg-blue-600 block px-3 py-2 rounded-md text-base font-medium transition duration-200 ease-in-out"
                  >
                    <svg
                      className="mr-2 h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/features"
                    className="text-white hover:bg-blue-600 block px-3 py-2 rounded-md text-base font-medium transition duration-200 ease-in-out"
                    onClick={() => setIsOpen(false)}
                  >
                    Features
                  </Link>

                  <Link
                    to="/about"
                    className="text-white hover:bg-blue-600 block px-3 py-2 rounded-md text-base font-medium transition duration-200 ease-in-out"
                    onClick={() => setIsOpen(false)}
                  >
                    About
                  </Link>
                  <Link
                    to="/login"
                    className="text-white hover:bg-blue-600 block px-3 py-2 rounded-md text-base font-medium transition duration-200 ease-in-out"
                    onClick={() => setIsOpen(false)}
                  >
                    <FaSignInAlt className="inline-block mr-2" />
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="text-white hover:bg-blue-600 block px-3 py-2 rounded-md text-base font-medium transition duration-200 ease-in-out"
                    onClick={() => setIsOpen(false)}
                  >
                    <FaUserPlus className="inline-block mr-2" />
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;
