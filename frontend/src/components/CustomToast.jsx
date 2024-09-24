import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import "../CustomToast.css";

import {
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

const toastIcons = {
  success: <FaCheckCircle className="text-green-500 text-xl" />,
  error: <FaExclamationCircle className="text-red-500 text-xl" />,
  info: <FaInfoCircle className="text-blue-500 text-xl" />,
  warning: <FaExclamationTriangle className="text-yellow-500 text-xl" />,
};

const toastColors = {
  success: "bg-green-50 border-green-200",
  error: "bg-red-50 border-red-200",
  info: "bg-blue-50 border-blue-200",
  warning: "bg-yellow-50 border-yellow-200",
};

const CustomToast = ({ message, type }) => (
  <motion.div
    initial={{ opacity: 0, y: -50, scale: 0.3 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 20, scale: 0.5 }}
    transition={{ type: "spring", stiffness: 100, damping: 15 }}
    className={`flex items-center p-4 rounded-lg shadow-lg border ${toastColors[type]} max-w-md w-full mx-auto`}
  >
    <div className="flex-shrink-0 mr-3">{toastIcons[type]}</div>
    <div className="flex-grow text-sm font-medium text-gray-900">{message}</div>
  </motion.div>
);

export const showToast = (message, type = "info") => {
  toast(<CustomToast message={message} type={type} />, {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

export const ToastProvider = ({ children }) => (
  <>
    {children}
    <ToastContainer
      position="top-center"
      autoClose={3000}
      hideProgressBar
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      className="mt-16 sm:mt-20"
    />
  </>
);
