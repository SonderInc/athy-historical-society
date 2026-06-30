import { createFileRoute, useSearch } from "@tanstack/react-router";
import { z } from "zod";

const searchSchema = z.object({
  verified: z.enum(["success", "invalid", "already"]).optional(),
});

export const Route = createFileRoute("/verify")({
  validateSearch: searchSchema,
  component: VerifyPage,
});

function VerifyPage() {
  const { verified } = Route.useSearch();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f5ee] px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center border-2"
            style={{ borderColor: verified === "success" ? "#3d5a3e" : "#c8a96e", backgroundColor: verified === "success" ? "#edf4ee" : "#fdf6e8" }}>
            {verified === "success" ? (
              <svg className="w-8 h-8 text-[#3d5a3e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-8 h-8 text-[#c8a96e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M12 5a7 7 0 100 14 7 7 0 000-14z" />
              </svg>
            )}
          </div>
        </div>

        {verified === "success" && (
          <>
            <h1 className="text-2xl font-serif font-bold text-[#2c2c2c] mb-3">Email Confirmed</h1>
            <p className="text-[#555] mb-6">Your interest has been confirmed and your name has been added to the list of participants. Thank you for supporting the establishment of the Athy Historical Society.</p>
          </>
        )}
        {verified === "already" && (
          <>
            <h1 className="text-2xl font-serif font-bold text-[#2c2c2c] mb-3">Already Confirmed</h1>
            <p className="text-[#555] mb-6">Your email address has already been verified. Your name is on the list of interested participants.</p>
          </>
        )}
        {verified === "invalid" && (
          <>
            <h1 className="text-2xl font-serif font-bold text-[#2c2c2c] mb-3">Invalid Link</h1>
            <p className="text-[#555] mb-6">This verification link is not valid or has already been used. Please return to the main page and re-submit your details if needed.</p>
          </>
        )}

        <a href="/" className="inline-block bg-[#3d5a3e] text-white font-serif px-6 py-2 rounded hover:bg-[#2e4430] transition-colors">
          Return to Home
        </a>
      </div>
    </div>
  );
}
