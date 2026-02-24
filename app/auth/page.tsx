"use client";

import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailAuth = async () => {
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      router.push("/cars");
    } catch (error) {
      console.error(error);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    router.push("/cars");
  };

  return (
    <section className="padding-x padding-y max-width">
      <div className="mx-auto max-w-md bg-white p-6 rounded-lg shadow-md space-y-4">
        <h1 className="text-2xl font-bold text-center">
          {isRegister ? "Register" : "Login"}
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded-md p-2"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border rounded-md p-2"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleEmailAuth}
          className="w-full bg-primary-blue text-white py-2 rounded-md"
        >
          {isRegister ? "Register" : "Login"}
        </button>

        <button
          onClick={handleGoogleLogin}
          className="w-full bg-black text-white py-2 rounded-md"
        >
          Continue with Google
        </button>

        <p
          className="text-sm text-center cursor-pointer text-gray-500"
          onClick={() => setIsRegister(!isRegister)}
        >
          {isRegister
            ? "Already have an account?"
            : "Don't have an account?"}
        </p>
      </div>
    </section>
  );
}