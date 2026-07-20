import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthProvider";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#09090f] text-white p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-semibold">Welcome, {user?.name || "User"}</h1>
            <p className="text-sm text-white/60 mt-2">
              This is your personal dashboard. Your email is <strong>{user?.email}</strong>.
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-2xl bg-white/5 border border-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/10"
          >
            Logout
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold mb-2">Your profile</h2>
            <p className="text-sm text-white/70">Personalized dashboard content will appear here.</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold mb-2">Secure session</h2>
            <p className="text-sm text-white/70">Only authenticated users can access this page.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
