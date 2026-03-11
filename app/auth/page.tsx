"use client";

import { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { CustomButton } from "@/components";
import { FirebaseError } from "firebase/app";
import { useAuth } from "@/contents/AuthContext";
import { isAdmin } from "@/utils";

const provider = new GoogleAuthProvider();

const ERROR_MESSAGES: Record<string, string> = {
  "auth/user-not-found":
    "No user found with this email. Please register first :P",
  "auth/wrong-password": "Wrong password. Try again :D",
  "auth/email-already-in-use":
    "This email is already registered. Try logging in :D",
  "auth/invalid-credential": "Invalid email or password :(",
  "auth/popup-closed-by-user": "Google sign-in was cancelled :(",
};

export default function AuthPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // errrors processing
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const admin = isAdmin(user?.email);

  useEffect(() => {
    if (!authLoading && user) {
      if (isAdmin(user.email)) {
        router.replace("/admin");
      } else {
        router.replace("/cars");
      }
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return <div>Loading...</div>;
  }

  if (user) {
    return null;
  }

  const getFirebaseError = (err: unknown): string => {
    const firebaseError = err as FirebaseError;
    return (
      ERROR_MESSAGES[firebaseError.code] ||
      "Something went wrong. Please try again."
    );
  };

  const validateForm = (): string | null => {
    if (!email.trim() || !password.trim())
      return "Pls, fill in all fields dude :(";
    if (!isValidEmail(email)) return "Pls, enter a valid email :)";
    if (password.length < 6)
      return "The password should be at least 6 characters, sorry(";
    return null;
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleEmailAuth = async () => {
    setError("");
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      const firebaseError = error as FirebaseError;
      setError(getFirebaseError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, provider);
    } catch (error) {
      const firebaseError = error as FirebaseError;
      setError(getFirebaseError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) {
      handleEmailAuth();
    }
  };

  return (
    <section className="overflow-hidden">
      <div className="mt-12 padding-x padding-y max-width">
        <div className="mx-auto max-w-md bg-white p-6 rounded-lg shadow-md space-y-4">
          <h1 className="text-2xl font-bold text-center">
            {isRegister ? "Register" : "Login"}
          </h1>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md text-sm text-center">
              {error}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleEmailAuth();
            }}
            noValidate
          >
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                className="w-full border rounded-md p-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                onKeyDown={handleKeyDown}
                autoComplete="email"
              />

              <input
                type="password"
                placeholder="Password"
                className="w-full border rounded-md p-2"
                value={password}
                onKeyDown={handleKeyDown}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={isRegister ? "new-password" : "current-password"}
                disabled={loading}
              />

              <CustomButton
                title={isRegister ? "Register" : "Login"}
                handleClick={handleEmailAuth}
                isDisabled={loading}
                containerStyles={
                  "w-full bg-primary-blue text-white py-2 rounded-3xl"
                }
              ></CustomButton>
            </div>
          </form>

          <CustomButton
            title="Continue with Google"
            handleClick={handleGoogleLogin}
            isDisabled={loading}
            containerStyles={"w-full bg-black text-white py-2 rounded-3xl"}
            rightIcon="/google.svg"
          ></CustomButton>

          <p
            className="text-sm text-center cursor-pointer text-gray-500"
            onClick={() => setIsRegister(!isRegister)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) =>
              e.key === "Enter" && setIsRegister((prev) => !prev)
            }
          >
            {isRegister ? "Already have an account?" : "Don't have an account?"}
          </p>
        </div>
      </div>
    </section>
  );
}
