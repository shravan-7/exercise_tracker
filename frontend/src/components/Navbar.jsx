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
          "http://localhost:8000/api/user-profile/",
          {
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
          }
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
    { to: "/contact", text: "Contact Us", icon: FaEnvelope },
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-400 to-blue-700 shadow-lg">
      {/* ... */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* ... */}
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
                {/* ... */}
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-white hover:bg-blue-500 hover:bg-opacity-50 px-3 py-2 rounded-md text-sm font-medium transition duration-200 ease-in-out"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md text-sm font-medium transition duration-200 ease-in-out"
                >
                  Register
                </Link>
              </>
            )}
          </div>
          {/* ... */}
        </div>
      </div>
      {/* ... */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-blue-700">
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
                  {/* ... */}
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-white hover:bg-blue-600 block px-3 py-2 rounded-md text-base font-medium transition duration-200 ease-in-out"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="text-white hover:bg-blue-600 block px-3 py-2 rounded-md text-base font-medium transition duration-200 ease-in-out"
                    onClick={() => setIsOpen(false)}
                  >
                    Register
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

