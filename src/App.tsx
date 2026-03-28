import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Notifications from './pages/Notifications';
import JobSearch from './pages/JobSearch';
import Profile from './pages/Profile';
import Scholarships from './pages/Scholarships';
import Mentorship from './pages/Mentorship';
import Achievements from './pages/Achievements';
import Onboarding from './pages/Onboarding';
import { FirebaseProvider, useFirebase } from './contexts/FirebaseContext';
import { useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, profile, loading } = useFirebase();
  const location = useLocation();
  
  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-surface">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to onboarding if not completed
  if (profile && !profile.onboarded && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  // If already onboarded, don't allow going back to onboarding
  if (profile && profile.onboarded && location.pathname === '/onboarding') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

export default function App() {
  return (
    <FirebaseProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="job-search" element={<JobSearch />} />
            <Route path="scholarships" element={<Scholarships />} />
            <Route path="mentorship" element={<Mentorship />} />
            <Route path="profile" element={<Profile />} />
            <Route path="achievements" element={<Achievements />} />
          </Route>
        </Routes>
      </Router>
    </FirebaseProvider>
  );
}
