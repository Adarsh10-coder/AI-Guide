import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./Pages/Auth/Login.jsx";
import "./App.css";
import SignUpPage from "./Pages/Auth/Signup.jsx";
import Home from "./Pages/Home.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
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
