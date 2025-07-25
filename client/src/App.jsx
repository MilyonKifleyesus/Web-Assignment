import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// Components
import Navbar from "./components/layout/Navbar.jsx";
import Layout from "./components/Layout.jsx";

// Pages
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Projects from "./pages/Projects.jsx";
import Services from "./pages/Services.jsx";
import Contact from "./pages/Contact.jsx";
import SignIn from "./pages/Signin.jsx";
import SignUp from "./pages/Signup.jsx";
import EducationForm from "./pages/EducationForm.jsx";
import ProjectForm from "./pages/ProjectForm.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  if (!token || !user) {
    return <SignIn />;
  }

  if (adminOnly) {
    const parsedUser = JSON.parse(user);
    if (parsedUser.role !== "admin") {
      return <Home />;
    }
  }

  return children;
};

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light")
  );

  useEffect(() => {
    // Set initial theme
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);

    // Add a brief delay to ensure proper initialization
    const timer = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timer);
  }, [theme]);

  if (isLoading) {
    return null; // Or return a loading spinner
  }

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-dark-900">
        <Navbar
          theme={theme}
          toggleTheme={() => setTheme(theme === "light" ? "dark" : "light")}
          className="relative z-50"
        />
        <AnimatePresence mode="wait">
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/services" element={<Services />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />

              {/* Protected Routes */}
              <Route
                path="/education"
                element={
                  <ProtectedRoute>
                    <EducationForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/project-form"
                element={
                  <ProtectedRoute>
                    <ProjectForm />
                  </ProtectedRoute>
                }
              />

              {/* Admin Only Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>
        </AnimatePresence>
      </div>
    </Router>
  );
}

export default App;
