import type { Metadata } from "next";
import "./globals.css";
import { Navbar, Footer, VerificationBanner } from "@/components";
import { AuthProvider } from "@/contents/AuthContext";

export const metadata: Metadata = {
  title: "Some cars",
  description: "Mercedes is the best car in the World!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="relative">
        <AuthProvider>
          <VerificationBanner />
          <Navbar />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
