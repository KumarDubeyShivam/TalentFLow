
import CreateJobs from "./features/jobs/Create-jobs.tsx";
import UpdateJobs from "./features/jobs/Update-jobs.tsx";
import CreateCandidates from "./features/candidates/Create-candidates.tsx";
import UpdateCandidates from "./features/candidates/Update-candidates.tsx";
import React from "react";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/lib/auth";
import { seedDatabase } from "@/lib/database";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Jobs from "./features/jobs/Jobs";
import Candidates from "./features/candidates/Candidates";
import Assessments from "./features/assessments/Assessments";
import CreateAssessments from "./features/assessments/Create-assessments";
import UpdateAssessments from "./features/assessments/Update-assessments";
import Settings from "./pages/Settings.tsx";
import Dashboard from "./pages/Dashboard";
import JobDetail from "./pages/JobDetail";
import AssessmentDetail from "./features/assessments/AssessmentDetail";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4" />
          <p>Loading TalentFlow...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

function AppRoutes() {
      // <Route path="/job/:jobid" element={
      //   <ProtectedRoute>
      //     <JobDetail />
      //   </ProtectedRoute>
      // } />
      // <Route path="/create-assessment" element={
      //   <ProtectedRoute>
      //     <CreateAssessments />
      //   </ProtectedRoute>
      // } />
      // <Route path="/job/:jobid" element={
      //   <ProtectedRoute>
      //     <JobDetail />
      //   </ProtectedRoute>
      // } />
      // <Route path="/create-assessment" element={
      //   <ProtectedRoute>
      //     <CreateAssessments />
      //   </ProtectedRoute>
      // } />
  const { user } = useAuth();

  useEffect(() => {
    // Seed database on app start
    seedDatabase();
  }, []);

  useEffect(() => {
    seedDatabase().then(() => {
      console.log('Seeding completed');
    }).catch((error) => {
      console.error('Seeding failed:', error);
    });
  }, []);

  return (
    <Routes>
      <Route 
        path="/login" 
        element={user ? <Navigate to="/" replace /> : <Login />} 
      />
      <Route
        path="/signup"
        element={user ? <Navigate to="/" replace /> : <Signup />}
      />
      <Route path="/" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      {/* Candidate (applicant) routes */}
      {user?.role === 'applicant' ? (
        <>
          <Route path="/jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
          <Route path="/job/:jobid" element={<ProtectedRoute><JobDetail /></ProtectedRoute>} />
          <Route path="/candidates" element={<ProtectedRoute><Candidates /></ProtectedRoute>} />
          <Route path="/candidates/create" element={<ProtectedRoute><CreateCandidates /></ProtectedRoute>} />
          <Route path="/candidates/update" element={<ProtectedRoute><UpdateCandidates /></ProtectedRoute>} />
          <Route path="/assessments" element={<ProtectedRoute><Assessments /></ProtectedRoute>} />
          <Route path="/assessment/:jobid" element={<ProtectedRoute><AssessmentDetail /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        </>
      ) : (
        <>
          <Route path="/jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
          <Route path="/jobs/create" element={<ProtectedRoute><CreateJobs /></ProtectedRoute>} />
          <Route path="/jobs/update" element={<ProtectedRoute><UpdateJobs /></ProtectedRoute>} />
          <Route path="/candidates" element={<ProtectedRoute><Candidates /></ProtectedRoute>} />
          <Route path="/assessments" element={<ProtectedRoute><Assessments /></ProtectedRoute>} />
          <Route path="/assessment/:jobid" element={<ProtectedRoute><AssessmentDetail /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/create-assessment" element={<ProtectedRoute><CreateAssessments /></ProtectedRoute>} />
          <Route path="/job/:jobid" element={<ProtectedRoute><JobDetail /></ProtectedRoute>} />
        </>
      )}
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
