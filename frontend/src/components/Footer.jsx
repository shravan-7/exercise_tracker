import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="app-footer bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-row lg:flex-row justify-between items-start lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full lg:w-1/3 text-center lg:mb-0"
          >
            <h4 className="text-xl font-semibold mb-3">Quick Links</h4>
            <ul className="flex flex-wrap justify-center space-x-4">
              <FooterLink to="/">Home</FooterLink>
              <FooterLink to="/features">Features</FooterLink>
              <FooterLink to="/about">About</FooterLink>
              <FooterLink to="/register">Register</FooterLink>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full lg:w-1/3 text-center mb-8 lg:mb-0"
          >
            <h3 className="text-2xl font-bold mb-3">Exercise Tracker</h3>
            <p className="text-base text-blue-200 mb-4 max-w-md mx-auto">
              Track your fitness journey and achieve your goals
            </p>
            <div className="flex justify-center space-x-4">
              <SocialIcon Icon={FaFacebookF} href="https://facebook.com" />
              <SocialIcon Icon={FaTwitter} href="https://twitter.com" />
              <SocialIcon Icon={FaInstagram} href="https://instagram.com" />
              <SocialIcon Icon={FaLinkedinIn} href="https://linkedin.com" />
              <SocialIcon Icon={FaYoutube} href="https://youtube.com" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="w-full lg:w-1/3 text-center"
          >
            <h4 className="text-xl font-semibold mb-3">Resources</h4>
            <ul className="flex flex-wrap justify-center space-x-4">
              <FooterLink to="/blog">Blog</FooterLink>
              <FooterLink to="/faq">FAQ</FooterLink>
              <FooterLink to="/guides">Guides</FooterLink>
              <FooterLink to="/support">Support</FooterLink>
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-8 pt-6 border-t border-blue-400 text-center text-sm text-blue-200"
        >
          <p>
            &copy; {new Date().getFullYear()} Exercise Tracker. All rights
            reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

const SocialIcon = ({ Icon, href }) => (
  <motion.a
    whileHover={{ scale: 1.2, y: -4 }}
    whileTap={{ scale: 0.9 }}
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="bg-white text-blue-600 p-2 sm:p-2.5 rounded-full hover:bg-blue-100 hover:text-indigo-700 transition duration-300 ease-in-out transform hover:shadow-lg"
  >
    <Icon size={16} className="sm:text-lg" />
  </motion.a>
);

const FooterLink = ({ to, children }) => (
  <li>
    <Link
      to={to}
      className="text-sm sm:text-base text-blue-200 hover:text-white transition duration-300 hover:underline"
    >
      {children}
    </Link>
  </li>
);

export default Footer;
