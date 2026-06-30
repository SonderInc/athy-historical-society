import { createFileRoute } from "@tanstack/react-router";
import { db } from "../../../../db/index.js";
import { participants } from "../../../../db/schema.js";
import { asc } from "drizzle-orm";

function checkAdminSession(request: Request): boolean {
  const cookie = request.headers.get("cookie") || "";
  return cookie.includes("admin-session=");
}

export const Route = createFileRoute("/api/admin/participants")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        if (!checkAdminSession(request)) {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const rows = await db
          .select()
          .from(participants)
          .orderBy(asc(participants.createdAt));

        return Response.json(rows);
      },
    },
  },
});
