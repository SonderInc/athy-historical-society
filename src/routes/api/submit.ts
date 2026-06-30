import { createFileRoute } from "@tanstack/react-router";
import { db } from "../../../db/index.js";
import { participants } from "../../../db/schema.js";
import { eq } from "drizzle-orm";
import { sendVerificationEmail } from "../../server/email.server.js";
import { randomBytes } from "crypto";

const emailPendingMessage =
  "The verification email could not be sent right now. Please try again later.";

export const Route = createFileRoute("/api/submit")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: { name?: string; email?: string };
        try {
          body = await request.json();
        } catch {
          return Response.json({ error: "Invalid request body" }, { status: 400 });
        }

        const name = (body.name || "").trim();
        const email = (body.email || "").trim().toLowerCase();

        if (!name || name.length < 2) {
          return Response.json({ error: "Please enter your full name." }, { status: 400 });
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          return Response.json({ error: "Please enter a valid email address." }, { status: 400 });
        }

        let existing: typeof participants.$inferSelect[];
        try {
          existing = await db
            .select()
            .from(participants)
            .where(eq(participants.email, email));
        } catch (err) {
          console.error("[/api/submit] DB select error:", err);
          return Response.json({ error: "A server error occurred. Please try again later." }, { status: 500 });
        }

        if (existing.length > 0) {
          if (existing[0].verified) {
            return Response.json({ error: "This email address is already registered." }, { status: 409 });
          }

          const token = randomBytes(32).toString("hex");

          try {
            await db
              .update(participants)
              .set({ name, verificationToken: token })
              .where(eq(participants.email, email));
          } catch (err) {
            console.error("[/api/submit] DB token refresh error:", err);
            return Response.json({ error: "A server error occurred. Please try again later." }, { status: 500 });
          }

          try {
            await sendVerificationEmail(email, name, token);
          } catch (err) {
            console.error("[/api/submit] Email resend error:", err);
            try {
              await db
                .update(participants)
                .set({
                  name: existing[0].name,
                  verificationToken: existing[0].verificationToken,
                })
                .where(eq(participants.email, email));
            } catch (restoreErr) {
              console.error("[/api/submit] DB restore after email resend error:", restoreErr);
            }
            return Response.json({ error: emailPendingMessage }, { status: 502 });
          }
          return Response.json({ message: "A verification email has already been sent. Please check your inbox." });
        }

        const token = randomBytes(32).toString("hex");

        try {
          await db.insert(participants).values({
            name,
            email,
            verificationToken: token,
            verified: false,
          });
        } catch (err) {
          console.error("[/api/submit] DB insert error:", err);
          return Response.json({ error: "A server error occurred. Please try again later." }, { status: 500 });
        }

        try {
          await sendVerificationEmail(email, name, token);
        } catch (err) {
          console.error("[/api/submit] Email send error:", err);
          try {
            await db.delete(participants).where(eq(participants.email, email));
          } catch (cleanupErr) {
            console.error("[/api/submit] DB cleanup after email error:", cleanupErr);
          }
          return Response.json({ error: emailPendingMessage }, { status: 502 });
        }

        return Response.json({
          message: "Thank you! A verification email has been sent. Please check your inbox to confirm your interest.",
        });
      },
    },
  },
});
