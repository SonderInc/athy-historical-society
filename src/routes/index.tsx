import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { z } from "zod";

const searchSchema = z.object({
  verified: z.enum(["success", "invalid", "already"]).optional(),
});

export const Route = createFileRoute("/")({
  validateSearch: searchSchema,
  component: HomePage,
});

function HomePage() {
  const { verified } = Route.useSearch();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [participants, setParticipants] = useState<string[]>([]);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/participants")
      .then((r) => r.json())
      .then((data) => setParticipants(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [status]);

  useEffect(() => {
    if (verified === "success" || verified === "already" || verified === "invalid") {
      setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 300);
    }
  }, [verified]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage(data.message);
        setName("");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "An error occurred. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Unable to submit. Please check your connection and try again.");
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f5ee] font-serif text-[#2c2c2c]">
      {/* Header */}
      <header className="bg-[#2e3d1f] text-[#f8f5ee]">
        <div className="max-w-4xl mx-auto px-6 py-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="h-px flex-1 bg-[#c8a96e] opacity-60" />
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="opacity-80">
              <circle cx="14" cy="14" r="12" stroke="#c8a96e" strokeWidth="1.5"/>
              <path d="M14 6v8l5 3" stroke="#c8a96e" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <div className="h-px flex-1 bg-[#c8a96e] opacity-60" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-wide text-[#f0e8d5]" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
            Athy Historical Society
          </h1>
          <p className="text-[#c8a96e] text-sm mt-2 tracking-widest uppercase">Established in the interest of Athy's heritage</p>
          <div className="flex items-center justify-center gap-3 mt-3">
            <div className="h-px flex-1 bg-[#c8a96e] opacity-40" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#c8a96e] opacity-60" />
            <div className="h-px flex-1 bg-[#c8a96e] opacity-40" />
          </div>
        </div>
      </header>

      {/* Verified banner */}
      {verified === "success" && (
        <div className="bg-[#edf4ee] border-b border-[#3d5a3e] text-[#2e4430] px-6 py-3 text-center text-sm">
          Your email has been verified. Your name has been added to the list of participants. Thank you.
        </div>
      )}
      {verified === "already" && (
        <div className="bg-[#fdf6e8] border-b border-[#c8a96e] text-[#7a5c1e] px-6 py-3 text-center text-sm">
          Your email address was already verified. Your name is on the list.
        </div>
      )}
      {verified === "invalid" && (
        <div className="bg-[#fef2f2] border-b border-red-300 text-red-700 px-6 py-3 text-center text-sm">
          This verification link is not valid. Please re-submit your details below.
        </div>
      )}

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Introduction */}
        <section className="mb-12">
          <div className="border-l-4 border-[#c8a96e] pl-6 mb-8">
            <p className="text-lg leading-relaxed text-[#3a3a3a] italic">
              This website has been created not as the work of a historian — I make no claim to that expertise — but as a platform to bring together those with an interest in the rich history of Athy.
            </p>
          </div>
          <div className="prose max-w-none text-[#3a3a3a] leading-relaxed space-y-4">
            <p>
              Athy is fortunate to have a community of individuals with extensive knowledge, experience, and research relating to the town's remarkable past. My aim is to provide a focal point where this collective expertise can come together to support the establishment of the Athy Historical Society.
            </p>
            <p>
              If you have an interest in Athy's history — whether as a researcher, academic, genealogist, local historian, archivist, or enthusiastic member of the community — I warmly invite you to add your name to the list of interested participants. Once sufficient interest has been established, details of the inaugural meeting of the Athy Historical Society will be announced.
            </p>
          </div>
        </section>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-12">
          <div className="h-px flex-1 bg-[#c8a96e] opacity-50" />
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <polygon points="10,2 12,8 18,8 13,12 15,18 10,14 5,18 7,12 2,8 8,8" stroke="#c8a96e" strokeWidth="1.2" fill="none"/>
          </svg>
          <div className="h-px flex-1 bg-[#c8a96e] opacity-50" />
        </div>

        {/* Proposal Document */}
        <section className="mb-14">
          <div className="bg-white border border-[#ddd0b8] rounded-sm shadow-sm overflow-hidden">
            <div className="bg-[#f0e8d5] border-b border-[#ddd0b8] px-8 py-5">
              <h2 className="text-xl font-bold text-[#2e3d1f]" style={{ fontFamily: "Georgia, serif" }}>
                Proposal to Establish the Athy Historical Society
              </h2>
              <p className="text-sm text-[#7a6b4e] mt-1">
                Prepared for community stakeholders interested in preserving, studying, and sharing the history of Athy.
              </p>
            </div>
            <div className="px-8 py-8 space-y-8 text-[#3a3a3a] leading-relaxed">
              <section>
                <h3 className="text-base font-bold text-[#2e3d1f] mb-3 uppercase tracking-wide text-xs border-b border-[#e8dcc8] pb-2">
                  1. Purpose and Rationale
                </h3>
                <p>
                  The Athy Historical Society (the "Society") is proposed as a non-partisan, inclusive, and community-driven organisation dedicated to preserving, documenting, and promoting the history of Athy. The Society is intended to bring together residents with diverse viewpoints who share a common interest in the town's historical record, cultural heritage, and collective memory. The core premise is that reasonable disagreement over interpretation can coexist with shared stewardship of facts, artifacts, and historical sources.
                </p>
              </section>

              <section>
                <h3 className="text-base font-bold text-[#2e3d1f] mb-3 uppercase tracking-wide text-xs border-b border-[#e8dcc8] pb-2">
                  2. Guiding Principles for Collaboration
                </h3>
                <p className="mb-3">To encourage participation across differing perspectives, the Society should be governed by the following principles:</p>
                <ul className="space-y-2 pl-4">
                  {[
                    ["Historical integrity", "prioritise primary sources, documentation, and verifiable records."],
                    ["Viewpoint neutrality", "the Society does not endorse political or ideological positions."],
                    ["Respectful discourse", "differing interpretations are permitted; personal attacks are not."],
                    ["Transparency", "decisions regarding collections, publications, and programming are documented and accessible."],
                    ["Community service", "activities should benefit current and future residents of Athy."],
                  ].map(([term, desc]) => (
                    <li key={term} className="flex gap-2">
                      <span className="text-[#c8a96e] mt-1">—</span>
                      <span><strong>{term}:</strong> {desc}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h3 className="text-base font-bold text-[#2e3d1f] mb-3 uppercase tracking-wide text-xs border-b border-[#e8dcc8] pb-2">
                  3. Organisational Description
                </h3>
                <p>
                  The Athy Historical Society will operate as a voluntary membership organisation with open enrolment. Its activities may include archival preservation, oral history projects, public lectures, publications, walking tours, exhibitions, and collaboration with schools, libraries, and municipal bodies. The Society will function independently while remaining open to partnerships that support its educational mission.
                </p>
              </section>

              <section>
                <h3 className="text-base font-bold text-[#2e3d1f] mb-3 uppercase tracking-wide text-xs border-b border-[#e8dcc8] pb-2">
                  4. Draft Charter of the Athy Historical Society
                </h3>
                <div className="space-y-4 pl-4 border-l-2 border-[#e8dcc8]">
                  {[
                    ["Article I – Name", "The name of the organisation shall be the Athy Historical Society."],
                    ["Article II – Mission", "The mission of the Athy Historical Society is to collect, preserve, interpret, and share materials relating to the history of Athy for educational and public benefit purposes."],
                    ["Article III – Membership", "Membership shall be open to any individual who supports the mission of the Society and agrees to abide by its governing documents and code of conduct. Membership categories, dues (if any), and voting rights may be established by by-laws."],
                    ["Article IV – Governance", "The Society shall be governed by a Board or Steering Committee elected by the membership. Officers may include, at minimum, a Chair, Secretary, and Treasurer. Terms, duties, and election procedures shall be set forth in the by-laws."],
                    ["Article V – Non-Partisanship", "The Society shall not engage in partisan political activity and shall not endorse political candidates or causes. Historical inquiry may address controversial topics, but programming shall be designed to educate rather than advocate."],
                    ["Article VI – Amendments", "This Charter may be amended by a supermajority vote of members present at a duly noticed meeting, in accordance with procedures established in the by-laws."],
                  ].map(([article, text]) => (
                    <div key={article} className="pt-3">
                      <h4 className="font-bold text-[#2e3d1f] mb-1">{article}</h4>
                      <p>{text}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-base font-bold text-[#2e3d1f] mb-3 uppercase tracking-wide text-xs border-b border-[#e8dcc8] pb-2">
                  5. Practical Steps to Formation
                </h3>
                <ul className="space-y-2 pl-4">
                  {[
                    "Convene an initial organising meeting of interested residents.",
                    "Establish a small interim steering group representing diverse perspectives.",
                    "Adopt this charter provisionally and draft initial by-laws.",
                    "Identify early projects with broad appeal (e.g., photo digitisation, cemetery records).",
                    "Select neutral meeting locations and rotate facilitators.",
                    "Develop a basic code of conduct for meetings and publications.",
                  ].map((step) => (
                    <li key={step} className="flex gap-2">
                      <span className="text-[#c8a96e] mt-1">—</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h3 className="text-base font-bold text-[#2e3d1f] mb-3 uppercase tracking-wide text-xs border-b border-[#e8dcc8] pb-2">
                  6. Managing Disagreement and Risk
                </h3>
                <p>
                  Given that historical interpretation can involve disagreement, the Society should distinguish clearly between factual records and interpretive commentary. Editorial policies, disclaimers for opinion-based programming, and clear moderation rules can reduce the risk of internal conflict and reputational harm.
                </p>
              </section>

              <section>
                <h3 className="text-base font-bold text-[#2e3d1f] mb-3 uppercase tracking-wide text-xs border-b border-[#e8dcc8] pb-2">
                  7. Conclusion
                </h3>
                <p>
                  By grounding its work in documented history, shared governance, and respectful engagement, the Athy Historical Society can become a durable institution that reflects the complexity of the town's past while serving its present community.
                </p>
              </section>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-12">
          <div className="h-px flex-1 bg-[#c8a96e] opacity-50" />
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <polygon points="10,2 12,8 18,8 13,12 15,18 10,14 5,18 7,12 2,8 8,8" stroke="#c8a96e" strokeWidth="1.2" fill="none"/>
          </svg>
          <div className="h-px flex-1 bg-[#c8a96e] opacity-50" />
        </div>

        {/* Participants list */}
        <section ref={formRef as React.RefObject<HTMLDivElement>} className="mb-14">
          <h2 className="text-xl font-bold text-[#2e3d1f] mb-2" style={{ fontFamily: "Georgia, serif" }}>
            Interested Participants
          </h2>
          <p className="text-sm text-[#7a6b4e] mb-6">
            The following individuals have expressed interest in the establishment of the Athy Historical Society.
          </p>

          {participants.length === 0 ? (
            <div className="bg-white border border-[#ddd0b8] rounded-sm p-6 text-center text-[#9a8a6a] italic text-sm">
              No participants yet. Be the first to add your name to the list.
            </div>
          ) : (
            <div className="bg-white border border-[#ddd0b8] rounded-sm">
              <ul className="divide-y divide-[#f0e8d5]">
                {participants.map((n, i) => (
                  <li key={i} className="px-6 py-3 flex items-center gap-3 text-[#3a3a3a]">
                    <span className="text-[#c8a96e] text-xs font-mono w-6 text-right flex-shrink-0">{i + 1}.</span>
                    <span>{n}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* Sign-up form */}
        <section className="mb-12">
          <div className="bg-[#f0e8d5] border border-[#ddd0b8] rounded-sm p-8">
            <h2 className="text-xl font-bold text-[#2e3d1f] mb-1" style={{ fontFamily: "Georgia, serif" }}>
              Express Your Interest
            </h2>
            <p className="text-sm text-[#7a6b4e] mb-6">
              Please add your name to this list if you would like to be notified about the inaugural meeting of the Athy Historical Society. Your email address will be used only for verification and notification purposes and will not be publicly displayed.
            </p>

            {status === "success" ? (
              <div className="bg-[#edf4ee] border border-[#3d5a3e] rounded p-4 text-[#2e4430] text-sm">
                <strong>Submission received.</strong> {message}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-[#2e3d1f] mb-1">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    minLength={2}
                    maxLength={100}
                    placeholder="Your full name"
                    className="w-full border border-[#c8b898] bg-white px-4 py-2 rounded text-[#2c2c2c] focus:outline-none focus:border-[#3d5a3e] text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-[#2e3d1f] mb-1">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="your@email.com"
                    className="w-full border border-[#c8b898] bg-white px-4 py-2 rounded text-[#2c2c2c] focus:outline-none focus:border-[#3d5a3e] text-sm"
                  />
                  <p className="text-xs text-[#9a8a6a] mt-1">
                    A verification email will be sent. Only your name (not your email) will appear publicly.
                  </p>
                </div>

                {status === "error" && (
                  <div className="bg-red-50 border border-red-200 rounded p-3 text-red-700 text-sm">
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="bg-[#3d5a3e] text-white px-8 py-2 rounded hover:bg-[#2e4430] transition-colors text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === "loading" ? "Submitting…" : "Submit"}
                </button>
              </form>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#2e3d1f] text-[#a8b898] text-center py-6 text-xs">
        <p>© {new Date().getFullYear()} Athy Historical Society. All rights reserved.</p>
        <p className="mt-1 text-[#7a8a6a]">athyheritagesociety.com</p>
      </footer>
    </div>
  );
}
