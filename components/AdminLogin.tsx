"use client";

import { useState } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { FirebaseError } from "firebase/app";
import { isAdmin } from "@/utils";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);

      if (!isAdmin(result.user.email)) {
        await signOut(auth);
        setError("You are not authorized as admin.");
      }
    } catch (err) {
      const e = err as FirebaseError;
      setError(e.message);
    }
  };

  return (
    <section className="overflow-hidden">
      <div className="padding-x padding-y max-width">
        <div className="mx-auto max-w-sm bg-white p-6 rounded-lg shadow-md space-y-4 mt-20">
          <h1 className="text-2xl font-bold text-center">Admin Login</h1>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <input
            type="email"
            placeholder="Email"
            className="w-full border rounded-md p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border rounded-md p-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />

          <button
            onClick={handleLogin}
            className="w-full bg-primary-blue text-white py-2 rounded-3xl font-semibold"
          >
            Login
          </button>
        </div>
      </div>
    </section>
  );
}