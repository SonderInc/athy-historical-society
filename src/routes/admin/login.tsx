import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/admin/login")({
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        // Redirect to dashboard
        window.location.href = "/admin/dashboard";
      } else {
        const data = await res.json();
        setError(data.error || "Login failed");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f5ee] font-serif text-[#2c2c2c] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white border border-[#ddd0b8] rounded-sm p-8">
        <h1 className="text-2xl font-bold text-[#2e3d1f] mb-2" style={{ fontFamily: "Georgia, serif" }}>
          Admin Access
        </h1>
        <p className="text-sm text-[#7a6b4e] mb-6">
          Athy Historical Society Administration
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-[#2e3d1f] mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@example.com"
              className="w-full border border-[#c8b898] bg-white px-4 py-2 rounded text-[#2c2c2c] focus:outline-none focus:border-[#3d5a3e] text-sm"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-[#2e3d1f] mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full border border-[#c8b898] bg-white px-4 py-2 rounded text-[#2c2c2c] focus:outline-none focus:border-[#3d5a3e] text-sm"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-3 text-red-700 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#3d5a3e] text-white px-4 py-2 rounded hover:bg-[#2e4430] transition-colors text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in…" : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
}
