import { createFileRoute } from "@tanstack/react-router";
import { db } from "../../../db/index.js";
import { participants } from "../../../db/schema.js";
import { eq } from "drizzle-orm";

export const Route = createFileRoute("/api/verify")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const token = url.searchParams.get("token");

        if (!token) {
          return Response.redirect(`/?verified=invalid`);
        }

        const rows = await db
          .select()
          .from(participants)
          .where(eq(participants.verificationToken, token));

        if (rows.length === 0) {
          return Response.redirect(`/?verified=invalid`);
        }

        if (rows[0].verified) {
          return Response.redirect(`/?verified=already`);
        }

        await db
          .update(participants)
          .set({ verified: true })
          .where(eq(participants.verificationToken, token));

        return Response.redirect(`/?verified=success`);
      },
    },
  },
});
