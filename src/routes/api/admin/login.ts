import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/admin/login")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: { email?: string; password?: string };
        try {
          body = await request.json();
        } catch {
          return Response.json({ error: "Invalid request" }, { status: 400 });
        }

        const adminEmail = process.env.ADMIN_EMAIL || "jaynbond@gmail.com";
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminPassword) {
          return Response.json(
            { error: "Admin password not configured" },
            { status: 500 }
          );
        }

        const { email, password } = body;

        if (email !== adminEmail || password !== adminPassword) {
          return Response.json(
            { error: "Invalid email or password" },
            { status: 401 }
          );
        }

        // Create session cookie
        const response = Response.json({ success: true });
        response.headers.set(
          "Set-Cookie",
          `admin-session=${Buffer.from(JSON.stringify({ email, timestamp: Date.now() })).toString("base64")}; Path=/; HttpOnly; SameSite=Lax${
            process.env.NODE_ENV === "production" ? "; Secure" : ""
          }`
        );

        return response;
      },
    },
  },
});
