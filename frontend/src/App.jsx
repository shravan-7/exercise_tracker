import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import "react-toastify/dist/ReactToastify.css";

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
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App bg-gray-100 min-h-screen">
          <ToastContainer
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />

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
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
