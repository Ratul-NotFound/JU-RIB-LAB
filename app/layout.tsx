import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { auth } from "@/lib/auth";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: {
    default: "Bioresources Technology and Industrial Biotechnology Laboratory | Jahangirnagar University",
    template: "%s | BTIB Lab — JU",
  },
  description:
    "Official website of the Bioresources Technology and Industrial Biotechnology Laboratory at Jahangirnagar University. Explore our research, projects, publications, and team.",
  keywords: [
    "bioresources technology",
    "industrial biotechnology",
    "biotechnology",
    "genetic engineering",
    "Jahangirnagar University",
    "research lab",
    "bioprocessing",
    "genomics",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "BTIB Lab — Jahangirnagar University",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en">
      <body>
        <SessionProvider session={session}>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
