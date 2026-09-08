import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthProvider";
import { User, LogOut, Settings, BrainCircuit } from "lucide-react";
import BB8Toggle from "./BB8Toggle";
import avatarPic from "../assets/avatar_pic.jpg";

export default function LargeHeader() {
  const [active, setActive] = useState("Home");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navItems = ["Home", "Features", "About"];

  return (
    <header className="w-full sticky top-0 z-20 bg-[var(--bg-primary)]/80 backdrop-blur-xl border-b border-[var(--theme-pink)]/20 shadow-[0_1px_20px_rgba(0,0,0,0.1)]">
      <div className="max-w-5xl mx-auto px-2 sm:px-3 h-20 flex items-center justify-start gap-4">
        <div className="flex items-center gap-3 shrink-0 ml-[-13rem]">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--theme-yellow)] to-[var(--theme-pink)] flex items-center justify-center shadow-md shadow-[var(--glow-yellow)]">
            <BrainCircuit size={20} className="text-white" strokeWidth={2} />
          </div>
          <span className="text-2xl font-semibold text-[var(--text-main)] whitespace-nowrap">AI Guide</span>
        </div>

        <nav className="flex-1 flex items-center gap-6 sm:gap-10 justify-center">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => {
                setActive(item);
                if (item === "Home") navigate("/home");
                else if (item === "Features") navigate("/resume-analysis");
                else navigate("/home");
              }}
              className={`text-base font-medium whitespace-nowrap transition-all duration-200 ease-out transform hover:scale-110 hover:-translate-y-0.5 origin-center ${active === item
                  ? "text-[var(--theme-pink)] drop-shadow-[0_0_8px_var(--glow-pink)]"
                  : "text-[var(--text-muted)] hover:text-[var(--theme-pink)] hover:drop-shadow-[0_0_8px_var(--glow-pink)]"
                }`}
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="relative shrink-0 flex justify-end ml-auto">
          <div className="relative flex items-center mr-[-1rem] sm:mr-[-2rem] md:mr-[-12rem]">
            <BB8Toggle checked={menuOpen} onChange={setMenuOpen} />
          </div>

          <div
            className={`absolute right-[-1rem] sm:right-[-2rem] md:right-[-12rem] top-14 w-52 rounded-2xl z-10 transition-all duration-300 ease-out origin-top-right p-[1px] bg-gradient-to-br from-[var(--theme-pink)]/40 to-[var(--theme-yellow)]/40 shadow-xl shadow-black/10 ${menuOpen ? "opacity-100 translate-x-0 scale-100 pointer-events-auto" : "opacity-0 translate-x-6 scale-95 pointer-events-none"
              }`}
          >
            <div className="rounded-2xl bg-[var(--bg-primary)]/95 backdrop-blur-xl overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--theme-pink)]/20">
                <div className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center shrink-0 border border-[var(--theme-pink)]/30">
                  <img src={avatarPic} alt="User Avatar" className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[var(--text-main)] truncate">{user?.name || "Guest user"}</p>
                  <p className="text-xs text-[var(--text-muted)] truncate">{user?.email || "guest@aiguide.com"}</p>
                </div>
              </div>
              <div className="p-1.5">
                <button className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-[var(--text-main)] hover:bg-[var(--theme-yellow)]/20 hover:text-[var(--theme-pink)] transition-colors group">
                  <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[var(--theme-pink)]/15 text-[var(--theme-pink)] transition-colors">
                    <Settings size={14} />
                  </span>
                  Profile
                </button>
                <button
                  onClick={async () => {
                    setMenuOpen(false);
                    await logout();
                    navigate("/login");
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-[var(--text-main)] hover:bg-[var(--theme-yellow)]/20 hover:text-[var(--theme-pink)] transition-colors group"
                >
                  <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[var(--theme-pink)]/15 text-[var(--theme-pink)] transition-colors">
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
