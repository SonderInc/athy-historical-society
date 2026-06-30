import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";

type Participant = {
  id: number;
  name: string;
  email: string;
  verified: boolean;
  createdAt: string;
};

export const Route = createFileRoute("/admin/dashboard")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    fetchParticipants();
  }, []);

  async function fetchParticipants() {
    try {
      const res = await fetch("/api/admin/participants");
      if (res.status === 401) {
        window.location.href = "/admin/login";
        return;
      }
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setParticipants(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Failed to load participants");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this participant?")) return;

    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/participants/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setParticipants(participants.filter((p) => p.id !== id));
      } else {
        alert("Failed to delete participant");
      }
    } catch {
      alert("Error deleting participant");
    } finally {
      setDeleting(null);
    }
  }

  async function handleExportCSV() {
    const csv = [
      ["Name", "Email", "Verified", "Created"],
      ...participants.map((p) => [
        p.name,
        p.email,
        p.verified ? "Yes" : "No",
        new Date(p.createdAt).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `athy-participants-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f5ee] font-serif flex items-center justify-center">
        <p className="text-[#7a6b4e]">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f5ee] font-serif text-[#2c2c2c]">
      {/* Header */}
      <header className="bg-[#2e3d1f] text-[#f8f5ee] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold" style={{ fontFamily: "Georgia, serif" }}>
            Admin Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-semibold"
          >
            Log Out
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="mb-8 grid grid-cols-3 gap-4">
          <div className="bg-white border border-[#ddd0b8] rounded-sm p-4">
            <p className="text-[#7a6b4e] text-sm">Total Participants</p>
            <p className="text-3xl font-bold text-[#2e3d1f]">{participants.length}</p>
          </div>
          <div className="bg-white border border-[#ddd0b8] rounded-sm p-4">
            <p className="text-[#7a6b4e] text-sm">Verified</p>
            <p className="text-3xl font-bold text-[#3d5a3e]">
              {participants.filter((p) => p.verified).length}
            </p>
          </div>
          <div className="bg-white border border-[#ddd0b8] rounded-sm p-4">
            <p className="text-[#7a6b4e] text-sm">Unverified</p>
            <p className="text-3xl font-bold text-[#c8a96e]">
              {participants.filter((p) => !p.verified).length}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mb-6 flex gap-4">
          <button
            onClick={handleExportCSV}
            className="bg-[#3d5a3e] hover:bg-[#2e4430] text-white px-6 py-2 rounded text-sm font-semibold"
          >
            Export CSV
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-4 text-red-700 mb-6">
            {error}
          </div>
        )}

        {/* Table */}
        <div className="bg-white border border-[#ddd0b8] rounded-sm overflow-hidden">
          {participants.length === 0 ? (
            <div className="p-8 text-center text-[#7a6b4e]">No participants yet</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-[#f0e8d5] border-b border-[#ddd0b8]">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-[#2e3d1f]">Name</th>
                  <th className="px-6 py-3 text-left font-semibold text-[#2e3d1f]">Email</th>
                  <th className="px-6 py-3 text-left font-semibold text-[#2e3d1f]">Status</th>
                  <th className="px-6 py-3 text-left font-semibold text-[#2e3d1f]">Created</th>
                  <th className="px-6 py-3 text-left font-semibold text-[#2e3d1f]">Action</th>
                </tr>
              </thead>
              <tbody>
                {participants.map((p) => (
                  <tr key={p.id} className="border-b border-[#f0e8d5] hover:bg-[#f9f7f2]">
                    <td className="px-6 py-3">{p.name}</td>
                    <td className="px-6 py-3 font-mono text-xs">{p.email}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          p.verified
                            ? "bg-[#edf4ee] text-[#3d5a3e]"
                            : "bg-[#fdf6e8] text-[#7a5c1e]"
                        }`}
                      >
                        {p.verified ? "Verified" : "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-xs text-[#7a6b4e]">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => handleDelete(p.id)}
                        disabled={deleting === p.id}
                        className="text-red-600 hover:text-red-800 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deleting === p.id ? "Deleting…" : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
