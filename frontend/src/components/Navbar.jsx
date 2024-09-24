import React, { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    logout();
    navigate("/");
  }, [logout, navigate]);

  const authLinks = [
    { to: "/dashboard", text: "Dashboard" },
    { to: "/exercises", text: "Exercises" },
    { to: "/routine", text: "Routine" },
    { to: "/progress", text: "Progress" },
    { to: "/profile", text: "Profile" },
  ];

  const publicLinks = [
    { to: "/login", text: "Login" },
    { to: "/register", text: "Register" },
  ];

  const links = isLoggedIn ? authLinks : publicLinks;

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <svg
                className="h-8 w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <span className="text-white font-bold text-xl tracking-tight">
                Exercise Tracker
              </span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-white hover:bg-blue-500 hover:bg-opacity-75 px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
                >
                  {link.text}
                </Link>
              ))}
              {isLoggedIn && (
                <button
                  onClick={handleLogout}
                  className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-blue-500 hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-600 focus:ring-white"
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
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-blue-500 bg-opacity-75">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-white hover:bg-blue-600 block px-3 py-2 rounded-md text-base font-medium transition duration-150 ease-in-out"
              >
                {link.text}
              </Link>
            ))}
            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="text-white bg-red-500 hover:bg-red-600 block px-3 py-2 rounded-md text-base font-medium w-full text-left transition duration-150 ease-in-out"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
