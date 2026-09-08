import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, User, ArrowRight, Sparkles, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthProvider";
import loginPic from "../../assets/login.png";

export default function SignUpPage() {
  const { signup } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!fullName || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const result = await signup(fullName.trim(), email.trim(), password);
      if (!result.success) {
        setError(result.message || "Failed to create account. Please try again.");
      } else {
        navigate("/login");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[var(--bg-secondary)] flex items-center justify-center p-4 sm:p-6 md:p-10 font-body relative overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Space+Grotesk:wght@600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600&display=swap');

        .font-headline { font-family: 'Syne', 'Space Grotesk', sans-serif; }
        .font-display { font-family: 'Plus Jakarta Sans', sans-serif; }
        .font-body { font-family: 'Inter', sans-serif; }

        @keyframes titleFloat {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-5px) scale(1.01); }
        }
        @keyframes floatBlur1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(12px, -12px) scale(1.06); }
        }
        @keyframes floatBlur2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-10px, 10px) scale(0.95); }
        }
        @keyframes softBlobFloat {
          0%, 100% { transform: translateY(0px) rotate(-12deg); }
          50% { transform: translateY(-8px) rotate(-8deg); }
        }

        .animate-title-float { animation: titleFloat 4s ease-in-out infinite; }
        .animate-float-blur-1 { animation: floatBlur1 8s ease-in-out infinite; }
        .animate-float-blur-2 { animation: floatBlur2 10s ease-in-out infinite; }
        .animate-soft-blob { animation: softBlobFloat 5s ease-in-out infinite; }

        .input-pill {
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .input-pill:focus-within {
          border-color: var(--theme-yellow);
          box-shadow: 0 0 0 4px var(--glow-yellow);
        }
      `}</style>

      {/* Main Container Card matching Login Page */}
      <div className="w-full max-w-4xl bg-white rounded-[30px] md:rounded-[44px] shadow-[0_25px_75px_rgba(0,0,0,0.08)] border border-white/90 p-3 md:p-5 relative z-10 flex flex-col md:flex-row min-h-[400px]">
        
        {/* ================= LEFT SECTION (Login Pic) ================= */}
        <div className="hidden md:block w-full md:w-[48%] relative overflow-hidden rounded-l-[30px] md:rounded-l-[44px] md:rounded-tr-[90px] md:rounded-br-[140px]">
          <img src={loginPic} alt="Signup" className="w-full h-full object-cover absolute inset-0" />
        </div>

        {/* ================= RIGHT SECTION (Signup Form) ================= */}
        <div className="w-full md:w-[52%] p-6 sm:p-8 md:p-10 md:pb-8 flex flex-col justify-between relative bg-white rounded-[32px] md:rounded-[44px]">
          
          {/* Top Bar: Green Badge + Emoji Avatar */}
          <div className="flex items-center justify-between mb-4">
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

            <div className="w-10 h-10 rounded-full bg-[var(--theme-yellow)] flex items-center justify-center shadow-md hover:scale-105 transition-transform duration-200 cursor-pointer">
              <span className="text-xl select-none">😃</span>
            </div>
          </div>

          {/* Form Area */}
          <div className="w-full max-w-md mx-auto my-auto">
            
            {/* Header (Exact same font style as Login page's Welcome back header) */}
            <div className="text-center mb-6 relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-12 bg-[var(--theme-yellow)]/10 blur-xl rounded-full pointer-events-none" />
              
              <h2 className="font-headline text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-800 to-[var(--theme-yellow)] tracking-tight mb-2 leading-tight">
                Create account
              </h2>
              <p className="font-body text-xs sm:text-sm font-semibold text-gray-500 flex items-center justify-center gap-1.5">
                <span>Please enter your details to create an account</span>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
              {/* Full Name Input */}
              <div>
                <label className="font-body block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="input-pill relative rounded-2xl border border-gray-200 bg-gray-50/70 hover:bg-gray-50 transition-all">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="fullName"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="font-body w-full bg-transparent pl-11 pr-4 py-3.5 text-sm text-gray-800 placeholder-gray-400 outline-none rounded-2xl font-medium"
                    required
                  />
                </div>
              </div>

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
                <label className="font-body block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                  Password
                </label>
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
                {loading ? "Creating..." : "Create Account"}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            {/* Switch to Login */}
            <p className="font-body text-xs text-gray-500 text-center mt-4">
              Already have an account?{" "}
              <Link to="/login" className="text-[var(--theme-yellow)] font-semibold hover:underline">
                Login
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
