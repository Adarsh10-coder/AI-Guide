import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FileSearch,
  Briefcase,
  Mic,
  Code2,
  Map,
} from "lucide-react";

export default function Sidebar() {
  const [active, setActive] = useState("Resume Analyzer");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const pathToLabel = {
      "/resume-analysis": "Resume Analyzer",
      "/resume-builder": "Resume Builder",
      "/chat": "Career Chatbot",
      "/live-jobs": "Live jobs",
      "/interview": "Mock interview",
      "/dsa-tracker": "DSA tracker",
      "/career-roadmap": "Career roadmap",
      "/home": "Resume Analyzer",
    };

    const label = pathToLabel[location.pathname];
    if (label) setActive(label);
  }, [location.pathname]);

  const navItems = [
    { label: "Resume Analyzer", icon: FileSearch },
    { label: "Live jobs", icon: Briefcase },
    { label: "Mock interview", icon: Mic },
    { label: "Career Chatbot", icon: Map },
    { label: "DSA tracker", icon: Code2 },
    { label: "Resume Builder", icon: FileSearch },
    { label: "Career roadmap", icon: Map },
  ];

  return (
    <aside className="h-full w-64 shrink-0 bg-[var(--bg-primary)]/95 backdrop-blur-xl border-r border-[var(--theme-pink)]/20 shadow-md flex flex-col">
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
                  "Resume Analyzer": "/resume-analysis",
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
                  ? "text-[var(--text-main)] bg-[var(--theme-yellow)]/20 border border-[var(--theme-yellow)]/40 shadow-[0_0_12px_var(--glow-yellow)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--theme-pink)]/10 hover:translate-x-1"
              }`}
            >
              <span
                className={`flex items-center justify-center w-8 h-8 rounded-lg shrink-0 transition-colors ${
                  isActive
                    ? "bg-[var(--theme-yellow)] text-[var(--text-main)]"
                    : "bg-[var(--theme-pink)]/10 text-[var(--theme-pink)] group-hover:bg-[var(--theme-pink)]/20"
                }`}
              >
                <Icon size={16} />
              </span>
              <span className="truncate">{label}</span>
              {isActive && (
                <span className="absolute right-2 w-1.5 h-1.5 rounded-full bg-[var(--theme-pink)] shadow-[0_0_6px_var(--glow-pink)]" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-[var(--theme-pink)]/20">
        <p className="text-xs text-[var(--text-muted)]">AI Guide v1.0</p>
      </div>
    </aside>
  );
}