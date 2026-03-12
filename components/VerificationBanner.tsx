"use client";
import { sendEmailVerification } from "firebase/auth";
import { useAuth } from "@/contents/AuthContext";
import { useState } from "react";
import { isAdmin } from "@/utils";
import { usePathname } from "next/navigation";

const VerificationBanner = () => {
  const { user } = useAuth();
  const pathname = usePathname();
  const [sent, setSent] = useState(false);
  const isGoogleUser = user?.providerData[0]?.providerId === "google.com";
  const admin = isAdmin(user?.email);
  if (pathname === "/auth") return null;
  if (!user || user.emailVerified || isGoogleUser || admin) return null;

  const handleResend = async () => {
    await sendEmailVerification(user);
    setSent(true);
  };

  return (
    <section className="">
      <div className="w-full bg-yellow-50 border-b border-yellow-200 px-6 py-2 flex items-center justify-between text-sm">
        <p className="text-yellow-700">
          {sent
            ? "Verification email sent! Check your inbox. I won't steal your data :/"
            : "Please verify your email to get full access."}
        </p>
        {!sent && (
          <button
            onClick={handleResend}
            className="text-yellow-700 font-semibold underline hover:text-yellow-900 transition"
          >
            Resend email
          </button>
        )}
      </div>
    </section>
  );
};

export default VerificationBanner;
