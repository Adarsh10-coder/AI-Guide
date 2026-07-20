import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch("http://localhost:5000/api/auth/profile", {
          credentials: "include",
        });
        if (!response.ok) {
          setUser(null);
          return;
        }
        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        return { success: false, message: data.message || "Login failed" };
      }

      setUser(data.user);
      return { success: true, user: data.user };
    } catch (error) {
      return { success: false, message: "Network error" };
    }
  };

  const signup = async (name, email, password) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        return { success: false, message: data.message || "Signup failed" };
      }

      // Do not auto-set the user after signup so the user can explicitly log in.
      return { success: true };
    } catch (error) {
      return { success: false, message: "Network error" };
    }
  };

  const logout = async () => {
    try {
      await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      // Ignore logout network errors
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
