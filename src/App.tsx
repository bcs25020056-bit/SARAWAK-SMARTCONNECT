import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Notifications from './pages/Notifications';
import JobSearch from './pages/JobSearch';

import Profile from './pages/Profile';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="job-search" element={<JobSearch />} />
          <Route path="courses" element={<div className="p-12 text-center font-headline font-bold text-3xl">Courses Page Coming Soon!</div>} />
          <Route path="mentorship" element={<div className="p-12 text-center font-headline font-bold text-3xl">Mentorship Page Coming Soon!</div>} />
          <Route path="profile" element={<Profile />} />
          <Route path="achievements" element={<div className="p-12 text-center font-headline font-bold text-3xl">Achievements Page Coming Soon!</div>} />
        </Route>
      </Routes>
    </Router>
  );
}
