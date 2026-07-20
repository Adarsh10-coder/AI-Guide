import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./Pages/Auth/Login.jsx";
import "./App.css";
import SignUpPage from "./Pages/Auth/Signup.jsx";
import Home from "./Pages/Home.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import Layout from "./Components/Layout";
import Chatpage from "./Pages/Chatpage.jsx";
import Interview from "./Pages/Interview.jsx";
import ResumeBuilder from "./Pages/resumeBuilder.jsx";
import ResumeAnalysis from "./Pages/resumeAnalysis.jsx";
import LiveJobs from "./Pages/livejobs.jsx";
import DsaTracker from "./Pages/dsaTracker.jsx";
import Roadmap from "./Pages/roadmap.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />

        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Layout>
                <Chatpage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/interview"
          element={
            <ProtectedRoute>
              <Layout>
                <Interview />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/resume-builder"
          element={
            <ProtectedRoute>
              <Layout>
                <ResumeBuilder />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/resume-analysis"
          element={
            <ProtectedRoute>
              <Layout>
                <ResumeAnalysis />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/live-jobs"
          element={
            <ProtectedRoute>
              <Layout>
                <LiveJobs />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dsa-tracker"
          element={
            <ProtectedRoute>
              <Layout>
                <DsaTracker />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/career-roadmap"
          element={
            <ProtectedRoute>
              <Layout>
                <Roadmap />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
