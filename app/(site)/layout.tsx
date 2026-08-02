import { auth } from "@/lib/auth";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <>
      <Navbar session={session} />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
