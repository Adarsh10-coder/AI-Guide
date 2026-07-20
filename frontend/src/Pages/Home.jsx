import React, { useState, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthProvider";
import {
  User,
  LogOut,
  Settings,
  BrainCircuit,
  ListChecks,
  Mic2,
  Radar,
  FileSearch,
  MessageCircle,
  FileEdit,
} from "lucide-react";

import * as THREE from "three";

/* ----------------------------------------------------------------
   Design tokens
   bg:        #0D0D0F  (void)
   plum:      #311432  (deep body)
   purple:    #8A2BE2  (primary signal)
   lavender:  #B47EF0  (highlight / glow)
   paper:     #F3F0F7  (text on dark)
   muted:     rgba(255,255,255,.6)
   display:   "Space Grotesk"  — headline, wide tracking, used sparingly
   body:      "Inter"          — paragraph + labels
------------------------------------------------------------------ */

function Header() {
  const [active, setActive] = useState("Home");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navItems = ["Home", "Features", "About"];

  return (
    <header className="w-full sticky top-0 z-20 bg-[#0D0D0F]/80 backdrop-blur-xl border-b border-[#8A2BE2]/20 shadow-[0_1px_20px_rgba(0,0,0,0.3)]">
      <div className="max-w-6xl mx-auto px-2 sm:px-3 h-20 flex items-center justify-start gap-4">
          <div className="flex items-center gap-3 shrink-0 ml-[-13.5rem]">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8A2BE2] to-[#311432] flex items-center justify-center shadow-md shadow-[#8A2BE2]/40">
            <BrainCircuit size={20} className="text-white" strokeWidth={2} />
          </div>
          <span className="text-2xl font-semibold text-white whitespace-nowrap">
            AI Guide
          </span>
        </div>

        <nav className="flex-1 flex items-center gap-6 sm:gap-10 justify-center">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => setActive(item)}
              className={`text-base font-medium whitespace-nowrap transition-all duration-200 ease-out transform hover:scale-110 hover:-translate-y-0.5 origin-center ${
                active === item
                  ? "text-[#B47EF0] drop-shadow-[0_0_8px_rgba(138,43,226,0.7)]"
                  : "text-white/60 hover:text-[#B47EF0] hover:drop-shadow-[0_0_8px_rgba(138,43,226,0.7)]"
              }`}
            >
              {item}
            </button>
          ))}
        </nav>

          <div className="relative shrink-0 flex justify-end ml-auto mr-[-18.5rem] sm:mr-[-10.5rem]">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Account menu"
            className="relative flex items-center w-20 h-10 rounded-full bg-[#311432]/60 hover:bg-[#311432]/80 border border-[#8A2BE2]/30 transition-colors px-2"
          >
            <div
              className={`w-9 h-9 rounded-full bg-gradient-to-br from-[#8A2BE2] to-[#311432] flex items-center justify-center transition-transform duration-300 ease-out transform ${
                menuOpen ? "translate-x-8" : "translate-x-0"
              }`}
            >
              <User size={16} className="text-white" />
            </div>
          </button>

          <div
            className={`absolute right-0 top-14 w-52 rounded-2xl z-10 transition-all duration-300 ease-out origin-top-right p-[1px] bg-gradient-to-br from-[#8A2BE2]/60 to-[#311432]/60 shadow-xl shadow-black/40 ${
              menuOpen
                ? "opacity-100 translate-x-0 scale-100 pointer-events-auto"
                : "opacity-0 translate-x-6 scale-95 pointer-events-none"
            }`}
          >
            <div className="rounded-2xl bg-[#0D0D0F]/95 backdrop-blur-xl overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#8A2BE2] to-[#311432] flex items-center justify-center shrink-0">
                  <User size={16} className="text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">{user?.name || 'Guest user'}</p>
                  <p className="text-xs text-white/50 truncate">{user?.email || 'guest@aiguide.com'}</p>
                </div>
              </div>
              <div className="p-1.5">
                <button className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-white/90 hover:bg-white/10 hover:text-[#B47EF0] transition-colors group">
                  <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#8A2BE2]/15 text-[#B47EF0] transition-colors">
                    <Settings size={14} />
                  </span>
                  Profile
                </button>
                <button
                  onClick={async () => {
                    setMenuOpen(false);
                    await logout();
                    navigate('/login');
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-white/90 hover:bg-white/10 hover:text-[#B47EF0] transition-colors group"
                >
                  <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#8A2BE2]/15 text-[#B47EF0] transition-colors">
                    <LogOut size={14} />
                  </span>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ----------------------------------------------------------------
   3D Robot — head yaws/pitches toward the cursor anywhere on screen.
   Built with raw three.js (no react-three-fiber) so it can live
   inside a plain div + canvas.
------------------------------------------------------------------ */
const RobotCanvas = React.lazy(() => import("./RobotCanvas.jsx"));

/* ----------------------------------------------------------------
   Home page
------------------------------------------------------------------ */
export default function Home() {
  const signals = [
    {
      icon: ListChecks,
      label: "DSA Tracker",
      copy: "Tracks weak topics and resurfaces them until they stick.",
    },
    {
      icon: Mic2,
      label: "Mock Interviews",
      copy: "Practice rounds scored the way real interviewers score.",
    },
    {
      icon: FileSearch,
      label: "Resume Analyzer",
      copy: "Flags gaps and weak lines before a recruiter does.",
    },
    {
      icon: FileEdit,
      label: "Resume Builder",
      copy: "Turns your progress into a resume that's ready to send.",
    },
    {
      icon: MessageCircle,
      label: "Career Chatbot",
      copy: "Answers the what-should-I-do-next question, always on.",
    },
    {
      icon: Radar,
      label: "Live Jobs",
      copy: "Roles unlock only once your prep says you're ready.",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-[#0D0D0F] text-[#F3F0F7]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');
        .font-display { font-family: 'Space Grotesk', sans-serif; }
        .font-body { font-family: 'Inter', sans-serif; }

        @keyframes reveal-up {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .reveal {
          opacity: 0;
          animation: reveal-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .reveal { animation: none; opacity: 1; transform: none; }
        }
      `}</style>

      <Header />

      <main className="font-body relative overflow-hidden">
        {/* ambient background glow */}
        <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-[#8A2BE2]/10 blur-[160px]" />

        <div className="max-w-6xl mx-auto px-6 sm:px-8 pt-16 pb-24 relative grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* Left: copy */}
          <div className="justify-self-start transform -translate-x-4 sm:-translate-x-30">
            <span
              className="reveal inline-block font-body text-xs tracking-[0.2em] uppercase text-[#B47EF0]/90 border border-[#8A2BE2]/30 rounded-full px-3 py-1 bg-[#8A2BE2]/10"
              style={{ animationDelay: "0ms" }}
            >
              Not a chatbot. A career co-pilot.
            </span>

            <h1 className="font-display text-4xl sm:text-5xl font-semibold leading-[1.08] tracking-tight mt-5">
              <span className="reveal block" style={{ animationDelay: "90ms" }}>
                One AI guide.
              </span>
              <span
                className="reveal block text-[#B47EF0]"
                style={{ animationDelay: "220ms" }}
              >
                Every step to the job.
              </span>
            </h1>

            <p
              className="reveal text-white/60 text-base sm:text-lg leading-relaxed mt-6 max-w-md"
              style={{ animationDelay: "360ms" }}
            >
              Prep, resume, mock rounds, and job alerts — reading off the same
              signal instead of four separate apps.
            </p>

            <div
              className="reveal flex flex-wrap items-center gap-3 mt-8"
              style={{ animationDelay: "480ms" }}
            >
              <button className="px-5 py-2.5 rounded-xl bg-gradient-to-br from-[#8A2BE2] to-[#B47EF0] text-white text-sm font-medium shadow-lg shadow-[#8A2BE2]/30 hover:shadow-[#8A2BE2]/50 transition-shadow">
                Lets's Start
              </button>
            </div>

            {/* Signals — parallel streams feeding one guide, not a numbered sequence */}
            <div
              className="reveal mt-12 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 max-w-lg"
              style={{ animationDelay: "600ms" }}
            >
              {signals.map(({ icon: Icon, label, copy }) => (
                <div
                  key={label}
                  className="flex items-start gap-3 pl-3.5 border-l-2 border-[#8A2BE2]/30"
                >
                  <span className="mt-0.5 flex items-center justify-center w-7 h-7 rounded-lg bg-[#8A2BE2]/15 text-[#B47EF0] shrink-0">
                    <Icon size={14} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">{label}</p>
                    <p className="text-xs text-white/50 leading-snug mt-0.5">{copy}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: 3D robot that watches the cursor */}
          <div className="relative h-[420px] sm:h-[520px] w-full justify-self-end transform translate-x-10 sm:translate-x-37">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-[#311432]/40 to-transparent" />
            <Suspense fallback={<div className="w-full h-full grid place-items-center">Loading preview...</div>}>
              <RobotCanvas />
            </Suspense>
            <p className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[11px] tracking-wide text-white/30 font-body">
              always watching your next move
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
