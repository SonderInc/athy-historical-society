import { createFileRoute } from "@tanstack/react-router";
import { db } from "../../../db/index.js";
import { participants } from "../../../db/schema.js";
import { eq, asc } from "drizzle-orm";

export const Route = createFileRoute("/api/participants")({
  server: {
    handlers: {
      GET: async () => {
        const rows = await db
          .select({ name: participants.name })
          .from(participants)
          .where(eq(participants.verified, true))
          .orderBy(asc(participants.createdAt));

        return Response.json(rows.map((r) => r.name));
      },
    },
  },
});
