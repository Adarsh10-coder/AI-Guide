import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileSearch,
  Briefcase,
  Mic,
  Code2,
  Map,
} from "lucide-react";

export default function Sidebar() {
  const [active, setActive] = useState("Resume analyser");
  const navigate = useNavigate();

  const navItems = [
    { label: "Resume analyser", icon: FileSearch },
    { label: "Live jobs", icon: Briefcase },
    { label: "Mock interview", icon: Mic },
    { label: "Career Chatbot", icon: Map },
    { label: "DSA tracker", icon: Code2 },
    { label: "Resume Builder", icon: FileSearch },
    { label: "Career roadmap", icon: Map },
  ];

  return (
    <aside className="h-screen w-64 shrink-0 bg-[#0D0D0F]/95 backdrop-blur-xl border-r border-[#8A2BE2]/20 flex flex-col">
      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {navItems.map(({ label, icon: Icon }) => {
          const isActive = active === label;
          return (
            <button
              key={label}
              onClick={() => {
                setActive(label);
                // map label to route
                const map = {
                  "Resume analyser": "/resume-analysis",
                  "Resume Builder": "/resume-builder",
                  "Career Chatbot": "/chat",
                  "Live jobs": "/live-jobs",
                  "Mock interview": "/interview",
                  "DSA tracker": "/dsa-tracker",
                  "Career roadmap": "/career-roadmap",
                };
                const path = map[label] || "/home";
                navigate(path);
              }}
              className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ease-out ${
                isActive
                  ? "text-white bg-gradient-to-r from-[#8A2BE2]/30 to-[#311432]/30 border border-[#8A2BE2]/40 shadow-[0_0_12px_rgba(138,43,226,0.25)]"
                  : "text-white/60 hover:text-white hover:bg-[#311432]/40 hover:translate-x-1"
              }`}
            >
              <span
                className={`flex items-center justify-center w-8 h-8 rounded-lg shrink-0 transition-colors ${
                  isActive
                    ? "bg-gradient-to-br from-[#8A2BE2] to-[#311432] text-white"
                    : "bg-[#8A2BE2]/10 text-[#B47EF0] group-hover:bg-[#8A2BE2]/20"
                }`}
              >
                <Icon size={16} />
              </span>
              <span className="truncate">{label}</span>
              {isActive && (
                <span className="absolute right-2 w-1.5 h-1.5 rounded-full bg-[#B47EF0] shadow-[0_0_6px_rgba(180,126,240,0.9)]" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-[#8A2BE2]/20">
        <p className="text-xs text-white/40">AI Guide v1.0</p>
      </div>
    </aside>
  );
}