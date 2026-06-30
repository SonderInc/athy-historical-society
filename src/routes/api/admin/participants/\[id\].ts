import { createFileRoute } from "@tanstack/react-router";
import { db } from "../../../../db/index.js";
import { participants } from "../../../../db/schema.js";
import { eq } from "drizzle-orm";

function checkAdminSession(request: Request): boolean {
  const cookie = request.headers.get("cookie") || "";
  return cookie.includes("admin-session=");
}

export const Route = createFileRoute("/api/admin/participants/$id")({
  server: {
    handlers: {
      DELETE: async ({ request, params }) => {
        if (!checkAdminSession(request)) {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const id = parseInt(params.id);
        if (isNaN(id)) {
          return Response.json({ error: "Invalid ID" }, { status: 400 });
        }

        await db.delete(participants).where(eq(participants.id, id));
        return Response.json({ success: true });
      },
    },
  },
});
