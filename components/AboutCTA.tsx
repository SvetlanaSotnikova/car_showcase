
"use client";
import Link from "next/link";
import { useAuth } from "@/contents/AuthContext";

export default function AboutCTA() {
  const { user } = useAuth();

  return user ? (
    <Link
      href="/cars"
      className="text-primary-blue bg-white border border-primary-blue rounded-full px-6 py-2.5 font-semibold text-sm hover:bg-blue-50 transition"
    >
      My Cars
    </Link>
  ) : (
    <Link
      href="/auth"
      className="text-primary-blue bg-white border border-primary-blue rounded-full px-6 py-2.5 font-semibold text-sm hover:bg-blue-50 transition"
    >
      Sign In
    </Link>
  );
}