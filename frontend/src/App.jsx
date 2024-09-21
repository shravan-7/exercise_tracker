import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
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
import "react-toastify/dist/ReactToastify.css";

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
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/login" component={Login} />
              <Route path="/register" component={Register} />
              <Route path="/dashboard" component={Dashboard} />
              <Route path="/exercises" component={ExerciseLibrary} />
              <Route path="/progress" component={Progress} />
              <Route path="/profile" component={Profile} />
              <Route path="/create-routine" component={CreateRoutine} />
              <Route path="/reminders" component={Reminders} />
              <Route path="/track-routine/:id" component={RoutineTracker} />
              <Route exact path="/routine/:id" component={RoutineDetails} />
              <Route exact path="/edit-routine/:id" component={EditRoutine} />
            </Switch>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
