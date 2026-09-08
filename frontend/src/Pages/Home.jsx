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
import LargeHeader from "../Components/LargeHeader";

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


/* ----------------------------------------------------------------
   3D Robot — head yaws/pitches toward the cursor anywhere on screen.
   Built with raw three.js (no react-three-fiber) so it can live
   inside a plain div + canvas.
------------------------------------------------------------------ */
const RobotCanvas = React.lazy(() => import("../Components/RobotCanvas"));

/* ----------------------------------------------------------------
   Home page
------------------------------------------------------------------ */
export default function Home() {
  const navigate = useNavigate();
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
    <div className="min-h-screen w-full bg-[var(--bg-primary)] text-[var(--text-main)]">
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

      <LargeHeader />

      <main className="font-body relative overflow-hidden">
        {/* ambient background glow */}
        <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-[var(--theme-yellow)]/10 blur-[160px]" />

        <div className="max-w-6xl mx-auto px-6 sm:px-8 pt-16 pb-24 relative grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* Left: copy */}
          <div className="justify-self-start transform -translate-x-4 sm:-translate-x-30">
            <span
              className="reveal inline-block font-body text-xs tracking-[0.2em] uppercase text-[var(--theme-pink)] border border-[var(--theme-pink)]/30 rounded-full px-3 py-1 bg-[var(--theme-pink)]/10"
              style={{ animationDelay: "0ms" }}
            >
              Not a chatbot. A career co-pilot.
            </span>

            <h1 className="font-display text-4xl sm:text-5xl font-semibold leading-[1.08] tracking-tight mt-5">
              <span className="reveal block" style={{ animationDelay: "90ms" }}>
                One AI guide.
              </span>
              <span
                className="reveal block text-[var(--theme-green)]"
                style={{ animationDelay: "220ms" }}
              >
                Every step to the job.
              </span>
            </h1>

            <p
              className="reveal text-[var(--text-muted)] text-base sm:text-lg leading-relaxed mt-6 max-w-md"
              style={{ animationDelay: "360ms" }}
            >
              Prep, resume, mock rounds, and job alerts — reading off the same
              signal instead of four separate apps.
            </p>

            <div
              className="reveal flex flex-wrap items-center gap-3 mt-8"
              style={{ animationDelay: "480ms" }}
            >
              <button onClick={() => navigate('/resume-analysis')} className="px-5 py-2.5 rounded-xl bg-[var(--theme-pink)] text-white text-sm font-medium shadow-lg shadow-[var(--glow-pink)] hover:shadow-[var(--theme-pink)]/80 transition-shadow">
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
                  className="flex items-start gap-3 pl-3.5 border-l-2 border-[var(--theme-yellow)]/50"
                >
                  <span className="mt-0.5 flex items-center justify-center w-7 h-7 rounded-lg bg-[var(--theme-yellow)]/20 text-[var(--theme-yellow)] shrink-0">
                    <Icon size={14} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-main)]">{label}</p>
                    <p className="text-xs text-[var(--text-muted)] leading-snug mt-0.5">{copy}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: 3D robot that watches the cursor */}
          <div className="relative h-[420px] sm:h-[520px] w-full justify-self-end transform translate-x-10 sm:translate-x-37">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-[var(--theme-yellow)]/10 to-transparent" />
            <Suspense fallback={<div className="w-full h-full grid place-items-center text-[var(--text-muted)]">Loading preview...</div>}>
              <RobotCanvas />
            </Suspense>
            <p className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[11px] tracking-wide text-[var(--text-muted)] font-body">
              always watching your next move
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
