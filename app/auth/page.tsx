"use client";

import { useState, useEffect, useRef } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { LoginForm, VerificationMessage } from "@/components";
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
  const [verificationSent, setVerificationSent] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      if (isAdmin(user.email)) {
        router.replace("/admin");
        return;
      }
      router.replace("/cars");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!verificationSent) return;
    const internal = setInterval(async () => {
      const currentUser = auth.currentUser;
      if (isAdmin(currentUser?.email)) return;
      if (currentUser) {
        await currentUser.reload();
        if (currentUser.emailVerified) {
          clearInterval(internal);
          router.replace("/cars");
        }
      }
    }, 3000);
    return () => clearInterval(internal);
  }, [verificationSent, router]);

  if (authLoading) {
    return <div>Loading...</div>;
  }

  if (user && !verificationSent) {
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
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );

        if (isAdmin(userCredential.user.email)) {
          router.replace("/admin");
          return;
        }

        await sendEmailVerification(userCredential.user);
        localStorage.setItem("verificationEmail", email); // ✅
        router.replace("/verify-email");
        setVerificationSent(true);
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

  if (verificationSent) return <VerificationMessage email={email} />;

  return (
    <LoginForm
      isRegister={isRegister}
      setIsRegister={setIsRegister}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      error={error}
      loading={loading}
      onSubmit={handleEmailAuth}
      onGoogleLogin={handleGoogleLogin}
    />
  );
}
