import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthProvider";
import loginImg from "../../assets/login.png";

// Neural network node layout
const nodes = [
  { id: "i1", x: 50, y: 90, layer: 0 },
  { id: "i2", x: 50, y: 190, layer: 0 },
  { id: "i3", x: 50, y: 290, layer: 0 },
  { id: "h1a", x: 190, y: 50, layer: 1 },
  { id: "h1b", x: 190, y: 150, layer: 1 },
  { id: "h1c", x: 190, y: 250, layer: 1 },
  { id: "h1d", x: 190, y: 340, layer: 1 },
  { id: "h2a", x: 330, y: 100, layer: 2 },
  { id: "h2b", x: 330, y: 210, layer: 2 },
  { id: "h2c", x: 330, y: 310, layer: 2 },
  { id: "o1", x: 460, y: 150, layer: 3 },
  { id: "o2", x: 460, y: 260, layer: 3 },
];

const byLayer = (n) => nodes.filter((node) => node.layer === n);
const edges = [];
for (let l = 0; l < 3; l++) {
  byLayer(l).forEach((a) => byLayer(l + 1).forEach((b) => edges.push({ a, b })));
}

export default function LoginPage() {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const result = await login(email.trim(), password);
    if (!result.success) {
      setError(result.message);
      return;
    }

    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen w-full bg-[#08070C] flex relative overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');

        .font-display { font-family: 'Space Grotesk', sans-serif; }
        .font-body { font-family: 'Inter', sans-serif; }

        @keyframes pulseDot {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        @keyframes flowLine {
          0% { stroke-dashoffset: 24; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes rotateAura {
          to { transform: rotate(360deg); }
        }
        @keyframes driftGlow {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, -15px); }
        }
        @keyframes floatChip {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .nn-node { animation: pulseDot 3.2s ease-in-out infinite; }
        .nn-edge { stroke-dasharray: 6 6; animation: flowLine 1.6s linear infinite; }
        .aura-spin { animation: rotateAura 7s linear infinite; }
        .drift-1 { animation: driftGlow 9s ease-in-out infinite; }
        .drift-2 { animation: driftGlow 11s ease-in-out infinite reverse; }
        .float-chip { animation: floatChip 4s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .nn-node, .nn-edge, .aura-spin, .drift-1, .drift-2, .float-chip { animation: none; }
        }

        .input-glow:focus-within {
          box-shadow: 0 0 0 3px rgba(154, 92, 246, 0.22), 0 0 20px rgba(154, 92, 246, 0.15);
        }
      `}</style>

      {/* ambient background texture */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="drift-1 pointer-events-none absolute -top-32 -left-20 w-[420px] h-[420px] rounded-full bg-[#8A5CF6]/20 blur-[110px]" />
      <div className="drift-2 pointer-events-none absolute bottom-[-140px] right-[-80px] w-[380px] h-[380px] rounded-full bg-[#5B2A9E]/25 blur-[110px]" />

      {/* Left: AI neural network illustration */}
      <div className="hidden md:flex w-1/2 items-center justify-center p-10 relative z-10">
        <div className="relative w-full max-w-md">
          <div className="float-chip inline-flex items-center gap-2 mb-6 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-sm">
            <Sparkles size={13} className="text-[#C9A6FF]" />
            <span className="font-body text-[11px] tracking-wide text-white/60">
              AI-powered access
            </span>
          </div>

          <div className="overflow-hidden rounded-[28px] border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.18)]">
            <img src={loginImg} alt="Login illustration" className="w-full h-auto object-cover" />
          </div>

          <div className="mt-6">
            <p className="font-display text-xl font-medium bg-gradient-to-r from-white to-[#C9A6FF] bg-clip-text text-transparent">
              Login to your account
            </p>
            <p className="font-body text-[13px] text-white/35 mt-2 max-w-xs leading-relaxed">
              Securely access your dashboard and continue where you left off.
            </p>
          </div>
        </div>
      </div>

      {/* Right: login form */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-6 py-12 relative z-10">
        <div className="w-full max-w-sm relative rounded-[28px] p-[1.5px] overflow-hidden">
          {/* rotating aura border */}
          <div
            className="aura-spin absolute -inset-[60%]"
            style={{
              background:
                "conic-gradient(from 0deg, transparent 0%, #8A5CF6 12%, transparent 28%, transparent 60%, #C9A6FF 72%, transparent 88%)",
            }}
          />

          <div className="relative z-10 rounded-[26px] bg-[#0D0C13]/95 backdrop-blur-xl px-8 py-9 border border-white/[0.06]">
            <div className="text-center mb-8">
              <h2 className="font-display inline-block text-[28px] font-semibold tracking-wide bg-gradient-to-r from-white to-[#C9A6FF] bg-clip-text text-transparent">
                Welcome back
              </h2>
              <p className="font-body text-[12.5px] text-white/35 mt-1.5">
                Sign in to pick up where you left off
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit} autoComplete="off">
              <input type="text" name="prevent_autofill_username" autoComplete="username" style={{ display: "none" }} readOnly tabIndex={-1} />
              <input type="password" name="prevent_autofill_password" autoComplete="new-password" style={{ display: "none" }} readOnly tabIndex={-1} />

              <div>
                <label className="font-body block text-[11px] font-medium text-white/50 mb-1.5 tracking-wide uppercase">
                  Email
                </label>
                <div className="input-glow relative rounded-xl transition-shadow">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B47EF0]" />
                  <input
                    type="email"
                    name="email"
                    autoComplete="off"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="font-body w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-3 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-[#8A5CF6]/60 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="font-body block text-[11px] font-medium text-white/50 mb-1.5 tracking-wide uppercase">
                  Password
                </label>
                <div className="input-glow relative rounded-xl transition-shadow">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B47EF0]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="off"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="font-body w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-[#8A5CF6]/60 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/35 hover:text-white/70 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && <div className="text-red-300 text-sm">{error}</div>}

              <button
                type="submit"
                className="font-body w-full py-2.5 rounded-xl bg-gradient-to-r from-[#8A5CF6] to-[#4C1D95] text-white text-sm font-medium shadow-[0_0_20px_rgba(138,43,226,0.35)] hover:shadow-[0_0_30px_rgba(138,43,226,0.55)] hover:-translate-y-[1px] active:translate-y-0 transition-all duration-200"
              >
                Sign in
              </button>
            </form>

            <p className="font-body text-xs text-white/35 text-center mt-8">
              Don't have an account? <Link to="/signup" className="text-[#C9A6FF] hover:text-white transition-colors">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}