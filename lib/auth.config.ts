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
    // jwt & session di sini (bukan cuma di auth.ts) karena middleware.ts pakai
    // authConfig ini langsung untuk decode token — tanpa ini, auth.user.role
    // selalu undefined di middleware walau token-nya sendiri sudah punya role.
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        if (token.role) session.user.role = token.role;
        if (token.sub) session.user.id = token.sub;
      }
      return session;
    },
  },
  providers: [], // diisi di auth.ts (Credentials provider butuh akses db)
} satisfies NextAuthConfig;
