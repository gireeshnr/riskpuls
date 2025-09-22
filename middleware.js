// middleware.js
export { default } from "next-auth/middleware";

// Protect these paths (requires active session)
export const config = {
  matcher: [
    "/risks",        // the Risks page
    "/api/risks/:path*" // all risks API routes
  ],
};
