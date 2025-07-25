import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';
import CreatorDashboard from './components/creator/CreatorDashboard';
import CreateWorkshop from './components/creator/CreateWorkshop';
import WorkshopManagement from './components/creator/WorkshopManagement';
import WorkshopListing from './components/participant/WorkshopListing';
import WorkshopRegistration from './components/participant/WorkshopRegistration';
import UserProfile from './components/participant/UserProfile';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WorkshopProvider } from './context/WorkshopContext';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-16">
        <Routes>
          <Route path="/" element={
            user ? (
              user.role === 'creator' ? 
              <Navigate to="/creator/dashboard" /> : 
              <Navigate to="/workshops" />
            ) : (
              <Navigate to="/workshops" />
            )
          } />
          
          <Route path="/login" element={
            user ? <Navigate to="/" /> : <Login />
          } />
          
          <Route path="/register" element={
            user ? <Navigate to="/" /> : <Register />
          } />
          
          <Route path="/workshops" element={<WorkshopListing />} />
          <Route path="/workshop/:id/register" element={<WorkshopRegistration />} />
          
          {user && user.role === 'creator' && (
            <>
              <Route path="/creator/dashboard" element={<CreatorDashboard />} />
              <Route path="/creator/create" element={<CreateWorkshop />} />
              <Route path="/creator/workshop/:id" element={<WorkshopManagement />} />
            </>
          )}
          
          {user && user.role === 'participant' && (
            <Route path="/profile" element={<UserProfile />} />
          )}
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <WorkshopProvider>
        <Router>
          <AppContent />
        </Router>
      </WorkshopProvider>
    </AuthProvider>
  );
}

export default App;