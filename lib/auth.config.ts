import type { NextAuthConfig } from "next-auth";

// Config yang aman dijalankan di Edge runtime (dipakai middleware.ts).
// Provider & logic yang butuh Node (bcrypt, db query) taruh di auth.ts, bukan di sini.
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdminRoute = nextUrl.pathname.startsWith("/admin");
      const isProtectedRoute =
        nextUrl.pathname.startsWith("/learn") || isAdminRoute;

      if (isAdminRoute) {
        return isLoggedIn && auth?.user?.role === "admin";
      }
      if (isProtectedRoute) {
        return isLoggedIn;
      }
      return true;
    },
  },
  providers: [], // diisi di auth.ts (Credentials provider butuh akses db)
} satisfies NextAuthConfig;
