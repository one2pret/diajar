import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";
import { V2Navbar } from "@/components/v2/navbar";
import { V2Footer } from "@/components/v2/footer";
import "./v2.css";

const fredoka = Fredoka({
  variable: "--font-v2-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const nunito = Nunito({
  variable: "--font-v2-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Diajar (v2 eksperimen)",
  description: "Varian tampilan eksperimen untuk landing page Diajar — dibandingkan dengan versi klasik.",
};

export default function V2Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${fredoka.variable} ${nunito.variable} v2-root flex min-h-screen flex-col`}>
      <V2Navbar />
      <main className="flex-1">{children}</main>
      <V2Footer />
    </div>
  );
}
