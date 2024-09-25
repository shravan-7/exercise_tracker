import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import { ToastProvider } from "./components/CustomToast";

// Import components
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import ExerciseLibrary from "./components/ExerciseLibrary";
import RoutineTracker from "./components/RoutineTracker";
import Progress from "./components/Progress";
import Profile from "./components/Profile";
import CreateRoutine from "./components/CreateRoutine";
import Reminders from "./components/Reminders";
import RoutineDetails from "./components/RoutineDetails";
import EditRoutine from "./components/EditRoutine";
import ContactUs from './components/ContactUs';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <div className="App bg-gray-100 min-h-screen">
            <Navbar />
            <div className="container mx-auto mt-4 px-4">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/exercises" element={<ExerciseLibrary />} />
                <Route path="/progress" element={<Progress />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/create-routine" element={<CreateRoutine />} />
                <Route path="/reminders" element={<Reminders />} />
                <Route path="/track-routine/:id" element={<RoutineTracker />} />
                <Route path="/routine/:id" element={<RoutineDetails />} />
                <Route path="/edit-routine/:id" element={<EditRoutine />} />
                <Route path="/contact" element={<ContactUs />} />
              </Routes>
            </div>
          </div>
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
