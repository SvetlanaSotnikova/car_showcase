"use client";

import { useSearchParams } from "next/navigation";
import CustomButton from "./CustomButton";

interface Props {
  isRegister: boolean;
  setIsRegister: React.Dispatch<React.SetStateAction<boolean>>;
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  error: string;
  loading: boolean;
  onSubmit: () => void;
  onGoogleLogin: () => void;
}

export default function LoginForm({
  isRegister,
  setIsRegister,
  email,
  setEmail,
  password,
  setPassword,
  error,
  loading,
  onSubmit,
  onGoogleLogin,
}: Props) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) onSubmit();
  };
  const params = useSearchParams();
  const reason = params.get("reason");
  return (
    <section className="overflow-hidden">
      <div className="mt-12 padding-x padding-y max-width">
        <div className="mx-auto max-w-md bg-white p-6 rounded-lg shadow-md space-y-4">
          {reason === "unverified" && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-2 rounded-md text-sm text-center">
              Your email was not verified in time. Please register again.
            </div>
          )}
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
              onSubmit();
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
                handleClick={onSubmit}
                isDisabled={loading}
                containerStyles={
                  "w-full bg-primary-blue text-white py-2 rounded-3xl"
                }
              ></CustomButton>
            </div>
          </form>

          <CustomButton
            title="Continue with Google"
            handleClick={onGoogleLogin}
            isDisabled={loading}
            containerStyles={"w-full bg-black text-white py-2 rounded-3xl"}
            rightIcon="/google.svg"
          ></CustomButton>

          <p
            className="text-sm text-center cursor-pointer text-gray-500"
            onClick={() => setIsRegister((prev) => !prev)}
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
