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
import Footer from "./components/Footer";
import About from "./components/About";
import Features from "./components/Features";
import WorkoutChallenges from "./components/WorkoutChallenges";

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <div className="app-container">
            <Navbar />
            <main className="main-content bg-gradient-to-br from-gray-50 to-blue-100">
              {/* <div className="container mx-auto mt-4 px-4"> */}
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
                <Route path="/about" element={<About />} />
                <Route path="/features" element={<Features />} />
                <Route
                  path="/workout-challenges"
                  element={<WorkoutChallenges />}
                />
              </Routes>
              {/* </div> */}
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
