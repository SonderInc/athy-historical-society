import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/admin/logout")({
  server: {
    handlers: {
      POST: async () => {
        const response = Response.json({ success: true });
        response.headers.set(
          "Set-Cookie",
          "admin-session=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax"
        );
        return response;
      },
    },
  },
});
