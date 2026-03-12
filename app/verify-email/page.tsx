"use client";

import { useEffect } from "react";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { VerificationMessage } from "@/components";

export default function VerifyEmailPage() {
  const router = useRouter();
  const email = localStorage.getItem("verificationEmail") ?? "";

  useEffect(() => {
    const interval = setInterval(async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        await currentUser.reload();
        if (currentUser.emailVerified) {
          clearInterval(interval);
          router.replace("/cars");
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [router]);

 return <VerificationMessage email={email} />;
}