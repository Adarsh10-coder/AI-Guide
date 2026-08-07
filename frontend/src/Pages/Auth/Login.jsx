import { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Activity,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthProvider";
import Login3D from "../../Components/Ai3dCanvas";

export default function LoginPage() {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const result = await login(email.trim(), password);
      if (!result.success) {
        setError(result.message || "Invalid credentials. Please try again.");
      } else {
        navigate("/home");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#EBF0F5] flex items-center justify-center p-4 sm:p-6 md:p-10 font-body relative overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Space+Grotesk:wght@600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600&display=swap');

        .font-headline { font-family: 'Syne', 'Space Grotesk', sans-serif; }
        .font-display { font-family: 'Plus Jakarta Sans', sans-serif; }
        .font-body { font-family: 'Inter', sans-serif; }

        @keyframes titleFloat {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-6px) scale(1.015); }
        }
        @keyframes floatBlur1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(15px, -15px) scale(1.08); }
        }
        @keyframes floatBlur2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-12px, 12px) scale(0.95); }
        }

        .animate-title-float { animation: titleFloat 4s ease-in-out infinite; }
        .animate-float-blur-1 { animation: floatBlur1 8s ease-in-out infinite; }
        .animate-float-blur-2 { animation: floatBlur2 10s ease-in-out infinite; }

        .input-pill {
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .input-pill:focus-within {
          border-color: #F59E0B;
          box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.12);
        }
      `}</style>

      {/* Main Container Card */}
      <div className="w-full max-w-6xl bg-white rounded-[32px] md:rounded-[40px] shadow-[0_20px_70px_rgba(0,0,0,0.07)] border border-white/80 p-3 md:p-5 relative z-10 flex flex-col md:flex-row min-h-[640px]">

        {/* ================= LEFT SECTION (Yellow card with 3D AI Components) ================= */}
        <div className="w-full md:w-[48%] bg-gradient-to-br from-[#FFD95A] via-[#FFC107] to-[#F59E0B] rounded-[28px] md:rounded-[34px] p-8 md:p-10 relative overflow-hidden flex flex-col justify-between min-h-[380px] md:min-h-[580px] shadow-inner">

          {/* Depth-of-field soft blurred 3D background shapes */}
          <div className="animate-float-blur-1 absolute top-8 left-8 w-24 h-24 rounded-full bg-white/40 blur-xl pointer-events-none" />
          <div className="animate-float-blur-2 absolute bottom-12 left-10 w-32 h-16 rounded-full bg-[#FFE699]/60 blur-xl pointer-events-none" />
          <div className="animate-float-blur-1 absolute top-1/2 right-4 w-28 h-28 rounded-full bg-[#FF9800]/30 blur-2xl pointer-events-none" />

          {/* Top Left Mini Sparkle Icon */}
          <div className="relative z-20 flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-black/10 backdrop-blur-md border border-black/10 flex items-center justify-center text-gray-900 shadow-sm">
              <Sparkles size={18} className="text-gray-900" />
            </div>
          </div>

          {/* Animated AI Guide Typography & Paragraph */}
          <div className="relative z-20 mt-2 md:mt-4">
            <h1 className="animate-title-float font-headline text-5xl sm:text-6xl md:text-7xl font-extrabold text-[#0F172A] leading-[1.02] tracking-tight drop-shadow-sm select-none">
              AI <br /> Guide
            </h1>
            <p className="font-body text-[#1E293B] text-xs sm:text-sm font-semibold mt-3 max-w-xs leading-relaxed">
              Experience the next-gen intelligent career workspace powered by neural models.
            </p>
          </div>

          {/* Center Interactive 3D AI Component Canvas */}
          <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-auto">
            <div className="w-full h-full max-w-md max-h-md">
              <Login3D />
            </div>
          </div>
        </div>

        {/* ================= RIGHT SECTION (Login Form) ================= */}
        <div className="w-full md:w-[52%] p-6 sm:p-8 md:p-12 flex flex-col justify-between relative bg-white rounded-[32px] md:rounded-[40px]">

          {/* Top Bar: Green "AUTHENTICATION LIVE SERVER" Badge + Right Emoji Badge */}
          <div className="flex items-center justify-between mb-4">
            {/* Green Theme Live Server Authentication Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 shadow-xs">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="font-display text-[11px] font-bold tracking-wider uppercase flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-600" />
                AUTHENTICATION
              </span>
            </div>

            {/* Top Right Emoji Face Avatar Badge */}
            <div className="w-10 h-10 rounded-full bg-[#FFC93C] flex items-center justify-center shadow-md hover:scale-105 transition-transform duration-200 cursor-pointer">
              <span className="text-xl select-none">😃</span>
            </div>
          </div>

          {/* Form Area */}
          <div className="w-full max-w-md mx-auto my-auto">

            {/* Attractive Welcome Back Header right above email */}
            <div className="text-center mb-8 relative">
              {/* Subtle ambient glow behind text */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-12 bg-amber-400/10 blur-xl rounded-full pointer-events-none" />

              <h2 className="font-headline text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-800 to-[#F59E0B] tracking-tight mb-2 leading-tight">
                Welcome back
              </h2>
              <p className="font-body text-xs sm:text-sm font-semibold text-gray-500 flex items-center justify-center gap-1.5">
                <span>Please enter your credentials to Login</span>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5" autoComplete="off">
              {/* Prevent Chrome auto-fill artifact inputs */}
              <input type="text" name="prevent_autofill_username" autoComplete="username" style={{ display: "none" }} readOnly tabIndex={-1} />
              <input type="password" name="prevent_autofill_password" autoComplete="new-password" style={{ display: "none" }} readOnly tabIndex={-1} />

              {/* Email Input */}
              <div>
                <label className="font-body block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="input-pill relative rounded-2xl border border-gray-200 bg-gray-50/70 hover:bg-gray-50 transition-all">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="font-body w-full bg-transparent pl-11 pr-4 py-3.5 text-sm text-gray-800 placeholder-gray-400 outline-none rounded-2xl font-medium"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-body block text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Password
                  </label>
                  <a href="#" className="font-body text-xs text-[#F59E0B] font-semibold hover:underline">
                    Forgot?
                  </a>
                </div>
                <div className="input-pill relative rounded-2xl border border-gray-200 bg-gray-50/70 hover:bg-gray-50 transition-all">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="font-body w-full bg-transparent pl-11 pr-11 py-3.5 text-sm text-gray-800 placeholder-gray-400 outline-none rounded-2xl font-medium"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="font-display w-full py-3.5 px-6 rounded-2xl bg-gray-900 hover:bg-black text-white text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 group active:scale-[0.99] disabled:opacity-70 mt-2"
              >
                {loading ? "Logging in..." : "Login"}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            {/* Switch to Signup */}
            <p className="font-body text-xs text-gray-500 text-center mt-6">
              Don't have an account?{" "}
              <Link to="/signup" className="text-[#F59E0B] font-semibold hover:underline">
                Sign up
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}