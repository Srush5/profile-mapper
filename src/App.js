import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import ProfileList from "./components/ProfileList";
import ProfileDetails from "./components/ProfileDetails";
import AdminPanel from "./components/AdminPanel";
import "./styles.css";

const App = () => {
  return (
    <Router>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/admin">Admin Panel</Link>
      </nav>
      <Routes>
        <Route path="/" element={<ProfileList />} />
        <Route path="/profile/:id" element={<ProfileDetails />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
};

export default App;
