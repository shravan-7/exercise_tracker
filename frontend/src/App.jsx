import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

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

function App() {
  return (
    <Router>
      <div className="App bg-gray-100 min-h-screen">
        <Navbar />
        <div className="container mx-auto mt-4 px-4">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/exercises" component={ExerciseLibrary} />
            <Route path="/routine" component={RoutineTracker} />
            <Route path="/progress" component={Progress} />
            <Route path="/profile" component={Profile} />
            <Route path="/create-routine" component={CreateRoutine} />
            <Route path="/reminders" component={Reminders} />
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
