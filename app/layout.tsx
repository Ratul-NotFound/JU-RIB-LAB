import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { auth } from "@/lib/auth";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: {
    default: "Biotechnology & Genetic Engineering Lab | Jahangirnagar University",
    template: "%s | BGE Lab — JU",
  },
  description:
    "Official website of the Biotechnology and Genetic Engineering Laboratory at Jahangirnagar University. Explore our research, projects, publications, and team.",
  keywords: [
    "biotechnology",
    "genetic engineering",
    "Jahangirnagar University",
    "research lab",
    "molecular biology",
    "genomics",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "BGE Lab — JU",
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
