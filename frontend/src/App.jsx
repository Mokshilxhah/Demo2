import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TechMarquee from './components/TechMarquee';
import WorkingFlow from './components/WorkingFlow';
import Features from './components/Features';
import TechStack from './components/TechStack';
import DemoProjects from './components/DemoProjects';
import GetStarted from './components/GetStarted';
import Footer from './components/Footer';

// Auth imports
import RegisterPage from './pages/auth/RegisterPage';
import LoginPage from './pages/auth/LoginPage';
import AdminLoginPage from './pages/auth/AdminLoginPage';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';
import UserDashboard from './pages/dashboard/UserDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TechMarquee />
        <WorkingFlow />
        <Features />
        <TechStack />
        <DemoProjects />
        <GetStarted />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin" element={<AdminLoginPage />} />
      <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
      
      {/* Protected Routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/dashboard" 
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } 
      />
    </Routes>
  );
}
