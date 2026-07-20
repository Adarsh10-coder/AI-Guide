import { useState } from "react";
import { User, LogOut, Settings, BrainCircuit } from "lucide-react";

export default function Header() {
  const [active, setActive] = useState("Dashboard");
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = ["Dashboard", "Features", "About"];

  return (
    <header className="w-full sticky top-0 z-20 bg-[#0D0D0F]/80 backdrop-blur-xl border-b border-[#8A2BE2]/20 shadow-[0_1px_20px_rgba(0,0,0,0.3)]">
      <div className="max-w-6xl mx-auto px-2 sm:px-3 h-16 flex items-center justify-start gap-4">
        {/* Left: Project name */}
        <div className="flex items-center gap-2 shrink-0 ml-[-0.75rem]">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#8A2BE2] to-[#311432] flex items-center justify-center shadow-md shadow-[#8A2BE2]/40">
            <BrainCircuit size={18} className="text-white" strokeWidth={2} />
          </div>
          <span className="text-lg font-semibold text-white whitespace-nowrap">
            AI Guide
          </span>
        </div>

        {/* Middle: Nav links */}
        <nav className="flex-1 flex items-center gap-6 sm:gap-10 justify-center">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => setActive(item)}
              className={`text-sm font-medium whitespace-nowrap transition-all duration-200 ease-out transform hover:scale-125 hover:-translate-y-0.5 origin-center ${
                active === item
                  ? "text-[#B47EF0] drop-shadow-[0_0_8px_rgba(138,43,226,0.7)]"
                  : "text-white/60 hover:text-[#B47EF0] hover:drop-shadow-[0_0_8px_rgba(138,43,226,0.7)]"
              }`}
            >
              {item}
            </button>
          ))}
        </nav>

        {/* Right: User profile */}
        <div className="relative shrink-0 flex justify-end ml-auto">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Account menu"
            className="relative flex items-center w-16 h-9 rounded-full bg-[#311432]/60 hover:bg-[#311432]/80 border border-[#8A2BE2]/30 transition-colors px-1"
          >
            <div
              className={`w-7 h-7 rounded-full bg-gradient-to-br from-[#8A2BE2] to-[#311432] flex items-center justify-center transition-transform duration-300 ease-out transform ${
                menuOpen ? "translate-x-7" : "translate-x-0"
              }`}
            >
              <User size={14} className="text-white" />
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
                  <p className="text-sm font-medium text-white truncate">Guest user</p>
                  <p className="text-xs text-white/50 truncate">guest@aiguide.com</p>
                </div>
              </div>
              <div className="p-1.5">
                <button className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-white/90 hover:bg-white/10 hover:text-[#B47EF0] transition-colors group">
                  <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#8A2BE2]/15 text-[#B47EF0] transition-colors">
                    <Settings size={14} />
                  </span>
                  Profile
                </button>
                <button className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-white/90 hover:bg-white/10 hover:text-[#B47EF0] transition-colors group">
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