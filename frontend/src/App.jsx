import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from './context/AuthContext';

// Providers & Contexts
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import InterviewRoom from './pages/InterviewRoom';
import CodingRound from './pages/CodingRound';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import Analytics from './pages/Analytics';
import ProfileSettings from './pages/ProfileSettings';
import Contact from './pages/Contact';
import AdminDashboard from './pages/AdminDashboard';
import BuildResume from './pages/BuildResume';
import QuizSection from './pages/QuizSection';
import DomainPractice from './pages/DomainPractice';

const AppRoutes = () => {
  const location = useLocation();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 gap-4">
        <span className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-slate-500 font-mono tracking-wider">VERIFYING SESSION...</p>
      </div>
    );
  }

  // Redirect unauthenticated users to login page
  if (!user && location.pathname !== '/auth') {
    return <Navigate to="/auth" replace />;
  }

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/interview" element={<InterviewRoom />} />
        <Route path="/coding" element={<CodingRound />} />
        <Route path="/resume" element={<ResumeAnalyzer />} />
        <Route path="/resume-builder" element={<BuildResume />} />
        <Route path="/quiz" element={<QuizSection />} />
        <Route path="/domain-practice" element={<DomainPractice />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/profile" element={<ProfileSettings />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 transition-colors duration-300 dark:bg-[#080c14] dark:text-slate-100 light:bg-[#f8fafc] light:text-[#0f172a] bg-grid-pattern">
            <Navbar />
            <main className="flex-1 w-full relative">
              <AppRoutes />
            </main>
            <Footer />
            <Chatbot />
          </div>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
